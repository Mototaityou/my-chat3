<script setup lang="ts">
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { ref } from 'vue';
import {
  getAuth,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import {
  getStorage,
  ref as REF,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { onMounted, defineProps } from 'vue';
import { getPerformance } from 'firebase/performance';
import MessageList from '/src/components/molecules/MessageList.vue';
import YouMustSignin from '../molecules/YouMustSignin.vue';

const youmustsignin = ref();

const props = defineProps(['textVariable']);


// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!getAuth().currentUser;
}

const getUserName = () => {
  const currentUser = getAuth().currentUser;
  if (currentUser === null || currentUser === undefined) {
    return
  }
  return currentUser.displayName;
}

const getProfilePicUrl = () => {
  const currentUser = getAuth().currentUser;
  if (currentUser === null || currentUser === undefined) {
    return
  }
  return currentUser.photoURL || '/images/profile_placeholder.png';
}

// Save a new message on the Cloud Firestore.
async function saveMessage(messageText: string) {
  console.log(messageText);
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), 'messages'), {
      name: getUserName(),
      text: messageText,
      profilePicUrl: getProfilePicUrl(),
      timestamp: firebase.firestore.Timestamp.now(),
    });
  }
  catch (error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}
// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  console.log('load OK!');
  // Create the query to load the last 100 messages and listen for new ones.
  const recentMessagesQuery = query(collection(getFirestore(), 'messages'), orderBy('timestamp', 'asc'), limit(100));
  console.log(recentMessagesQuery);
  // Start listening to the query.
  onSnapshot(recentMessagesQuery, (snapshot) => {
    console.log('snapshot OK');
    snapshot.docChanges().forEach((change) => {
      console.log(change.doc.data());
      if (change.type === 'removed') {
        deleteMessage(change.doc.id);
      }
      if (change.type === 'added') {
        const message = change.doc.data({ serverTimestamps: "estimate" });
        console.log('display OK!');
        items.value[change.doc.id] = message;
        console.log(items);
      }
      if (change.type === 'modified') {
        const message = change.doc.data({ serverTimestamps: "estimate" });
        console.log('display OK!');
        items.value[change.doc.id] = message;
      }
    });
  });
}


// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
async function saveImageMessage(file: File) {
  console.log('saveImageMessag is ON!');
  try {
    // 1 - We add message with a loading icon that will get updated with the shared image.
    const messageRef = await addDoc(collection(getFirestore(), 'messages'), {
      name: getUserName(),
      imageUrl: LOADING_IMAGE_URL,
      profilePicUrl: getProfilePicUrl(),
      timestamp: firebase.firestore.Timestamp.now(),
    });

    console.log('messageRef:' + messageRef);
    // 2 - Upload the image to Cloud Storage.
    const filePath = `${getAuth().currentUser?.uid}/${messageRef.id}/${file.name}`;
    const newImageRef = REF(getStorage(), filePath);
    const fileSnaoshot = await uploadBytesResumable(newImageRef, file);

    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);

    // 4 - Update the chat message placeholder with the image's URL.
    await updateDoc(messageRef, {
      imageUrl: publicImageUrl,
      storageUrl: fileSnaoshot.metadata.fullPath
    });


  } catch (error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  }
}

// Triggerd when the send new message form is submitted.
function onMessageFormSubmit(event: Event) {
  console.log(event);
  event.preventDefault();
  console.log(textareaValue.value);
  if (messageArea === undefined) {
    return
  }
  console.log(textareaValue.value);
  // Check that the user entered a message and is signed in.
  if (messageArea && checkSignedInWithMessage()) {
    console.log(textareaValue.value);
    saveMessage(textareaValue.value).then(function () {
      // clear message text field and re-enable the SEND button.
      console.log(textareaValue.value);
      resetMaterialTextfield(messageArea);
      toggleButton();
    })
  }
}

function onInput() {
  if (textareaValue.value === '') {
    TextSubmitable.value = true;
  } else {
    TextSubmitable.value = false;
  }
}


// Return true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  console.log('checkSignedInWithMessage is OK!');
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }
  console.log('isUserSignIn is OK!');
  // Display a message to the user using a Toast.
  setTimeout(() => {
    youmustsignin.value.youMustSignin = true;
  }, 1);
  const time = 1;
  clearTimeout(time);
  return false;
}

// Reset the given MetarialTextField.
function resetMaterialTextfield(element: HTMLInputElement) {
  textareaValue.value = '';
}

// A loading image URL.
const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id: string) {
  const div = document.getElementById(id);
  console.log(id);
  if (div === null) {
    return
  }
  // If an element for that message exists we delete it.
  if (div.parentNode) {
    div.parentNode.removeChild(div);
  }
}

const items = ref<any>({});

function toggleButton() {
  if (props.textVariable === null) {
    TextSubmitable.value = false;
  } else {
    TextSubmitable.value = true;
  }
}

// Shortcut to DOM Elements.
const TextSubmitable = ref(true);
const textareaValue = ref();
const imageValue = ref();
let messageArea: HTMLInputElement;

let messageListElement: HTMLElement
onMounted(() => {
  messageArea = document.getElementById('texterea') as HTMLInputElement;
  console.log(messageArea);
  messageListElement = document.getElementById('message')!;
  console.log(messageListElement);
  loadMessages();
})

// Trigggered when a file is selected via the media picker.
function onMediaFileSelected(event: Event) {
  console.log(event);
  event.preventDefault();
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  console.log(file);

  // Clear the selection in the file picker input.
  console.log(imageValue.value.length);
  imageValue.value.length = [];

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    setTimeout(() => {
      youmustsignin.value.youMustHaveImage = true;
    }, 2000);
    return;
  }
  console.log('file:' + file);
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}
// TODO 12: Initialize Firebase Performance Monitoring
getPerformance();

</script>
<template>
  <v-main class="bg-grey-lighten-3 pt-15 mt-10">
    <div id="margin-left">
      <v-sheet id="messages" width="500px" height="500px">
        <v-container fluid>
          <v-row>
            <v-col>
              <div id="message" class="message">
  
                <MessageList :items="items" >
                </MessageList>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <v-sheet width="500px">
        <v-form @submit.prevent>
          <v-container id="container">
            <v-row>
              <v-col cols="9">
                <v-textarea auto-grow max-rows="3" @input="onInput" v-model="textareaValue" id="texterea"
                  variant="underlined" color="#1131ff" label="Message" rows="1">
                </v-textarea>

              </v-col>
            </v-row>
            <v-btn :disabled="TextSubmitable" id="send" type="submit" rounded="lg" height="47" color="#ffaa00"
              @click="onMessageFormSubmit">送信</v-btn>

            <v-card color="orange" max-width="50" max-height="48" class="ml-auto" id="file">
              <v-card-text class="pa-1 ma-0">
                <v-file-input density="compact" accept="image/*" variant="solo" prepend-icon=""
                  @change="onMediaFileSelected" v-model="imageValue">
                  <template v-slot:append-inner>
                    <v-icon size="x-large" color="#1131ff" icon="mdi-image-area" id="file-icon"></v-icon>
                  </template>
                </v-file-input>
              </v-card-text>
            </v-card>
          </v-container>
        </v-form>
        <YouMustSignin ref="youmustsignin"></YouMustSignin>
      </v-sheet>
    </div>
  </v-main>
</template>
<style scoped>
.title {
  font-family: Helvetica;
  font-size: 2.3rem;
  font-weight: 550;
  margin-left: 0.3rem;
  letter-spacing: -0.08rem;
  color: rgb(17, 49, 255);
}

button.v-btn {
  color: rgb(17, 49, 255);
  font-family: Helvetica;
  letter-spacing: 0.0005rem;
  font-size: 0.9rem;
}

.mdi-account-circle {
  font-size: 2rem;
}

.mdi-account-circle::before {
  margin-right: -0.9rem;
}

#margin-left {
  margin-left: 10rem;
}


#messages {
  overflow-y: auto;
  height: 500px;
}

#container {
  top: 25rem;
}

#send {
  position: absolute;
  margin: -70px 120px 0;
  font-size: 18px;
  padding: 0;
}

#file {
  margin: -81px -10px 0;
}

#file-icon {
  margin: -3px -8px 0 0;
}
</style>
