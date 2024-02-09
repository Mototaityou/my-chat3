import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
})

/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */

const config = {
  /* TODO: ADD YOUR FIREBASE CONFIGURATION OBJECT HERE */
  apiKey: process.env["VUE_APP_CONFIG_APIKEY"],
  authDomain: process.env["VUE_APP_CONFIG_AUTHDOMAIN"],
  databaseURL: process.env["VUE_APP_CONFIG_DATABASEURL"],
  projectId: process.env["VUE_APP_CONFIG_PROJECTID"],
  storageBucket: process.env["VUE_APP_CONFIG_STORAGEBUCKE"],
  messagingSenderId: process.env["VUE_APP_CONFIG_MESSAGINGSENDERID"],
  appId: process.env["VUE_APP_CONFIG_APPID"],
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}

createApp(App).use(router).use(vuetify).mount('#app')
