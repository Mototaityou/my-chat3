<script setup lang="ts">
import LoginForm from '../molecules/LoginForm.vue';
import HeaderTitle from '../atoms/HeaderTitle.vue';
</script>
<template>
  <v-app-bar height="80" :elevation="3" id="header" color="rgb(255 170 0)">
    <HeaderTitle>
    </HeaderTitle>
    <LoginForm>
    </LoginForm>
  </v-app-bar>
</template>

<style scoped></style>