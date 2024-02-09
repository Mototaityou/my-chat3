<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps(['items'])

// mock remote data fetching
</script>

<template>
  <div v-for="(item, index) in props.items" :key="index" class="message-container">
    <v-sheet class="d-flex flex-wrap mx-left" max-width="500">
      <v-container fluid class="pb-2">
        <v-row>
          <v-col cols="1">
            <v-avatar size="28px">
              <v-img :src="item.profilePicUrl" alt="/src/assets/profile_placeholder.png"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="10">
            <p class="text-start text-body-2">
              {{ item.text }}
            </p>

            <div v-if="item.imageUrl !== undefined">
              <v-img class="bg-white" :aspect-ratio="2" :src="item.imageUrl">
              </v-img>
            </div>
            <p class="text-start text-caption font-weight-medium text-disabled pt-2">
              {{ item.name }}
            </p>
          </v-col>
        </v-row>
      </v-container>
      <v-divider :thickness="1" class="border-opacity-25" color="#AAAAAA"></v-divider>
    </v-sheet>
    
  </div>
</template>

<style scoped>

#margin-left {
  margin-left: 10rem;
}

#messages {
  overflow-y: auto;
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
