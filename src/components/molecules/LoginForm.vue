<script setup lang="ts">
import 'firebase/compat/firestore';
import { ref } from 'vue';
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

// Signs-in Friendly chat.
async function signIn() {
  //Sign in Firebase using popup auth and Google as the indentity provider.
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}
// Sign-out of Friendly Chat.
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}
//Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}
// Returns the signed-in user's profile Pic URL.
const getProfilePicUrl = () => {
  const currentUser = getAuth().currentUser;
  if (currentUser === null || currentUser === undefined) {
    return
  }
  return currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
const getUserName = () => {
  const currentUser = getAuth().currentUser;
  if (currentUser === null || currentUser === undefined) {
    return
  }
  return currentUser.displayName;
}


// Triggers when the auth state change for instance when the user sign-in or sign-out.
function authStateObserver(user: User | null) {
  if (user !== null) {
    // User is sign in!
    // Get the sign-in user's profile pic and name.
    const profilePicUrl = getProfilePicUrl();
    if (profilePicUrl !== undefined) {
      addSizeToGoogleProfilePic(profilePicUrl);
    }
    loginPic.value = profilePicUrl;

    const userName = getUserName();
    if (userName === null) {
      return
    }
    loginName.value = userName;

    // login and logout buttons are visible.
    textVariable.value = false;

    // We save the Firebase Messaging Device token and enable notifications.
    // saveMessagingDeviceToken();
  } else {
    // User is sined out!
    // Hide user's profile and sign-out button.
    textVariable.value = true;
  }
}

// Adds a size to Goole Plofile pics URLs.
function addSizeToGoogleProfilePic(url: string) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// Shortcut to DOM Elements.
const loginPic = ref();
const loginName = ref();

// login and logout button hedden or visible N
const textVariable = ref(true);

initFirebaseAuth();

</script>

<template v-slot:append>
  <v-btn v-if="!textVariable" id="log-in">
    <v-avatar>
      <v-img :src="loginPic" alt="human"></v-img>
    </v-avatar>
    <div>{{ loginName }}</div>
  </v-btn>
  <v-btn v-if="textVariable" id="sign-in" @click="signIn()"><v-icon start icon="mdi-account-circle"></v-icon>SIGN-IN
    WITH GOOGLE</v-btn>
  <v-btn v-if="!textVariable" id="sign-out" @click="signOutUser()">
    <v-icon start icon="mdi-account-circle"></v-icon>
    SIGN-OUT
  </v-btn>
</template>
<style scoped>
.v-toolbar-title__placeholder {
  overflow: visible;
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
</style>