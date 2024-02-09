<template>
  <v-app>
    <ChatHeader>
    </ChatHeader>
    
    <ChatMain>
    </ChatMain>
  </v-app>
</template>

<script setup lang="ts">
import { initializeApp } from 'firebase/app';
import 'firebase/compat/firestore';
import { getFirebaseConfig } from '../main';
import ChatHeader from './organisms/ChatHeader.vue';
import ChatMain from './organisms/ChatMain.vue';

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig)

</script>