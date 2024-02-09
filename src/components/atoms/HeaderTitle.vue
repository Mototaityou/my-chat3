<script setup lang="ts">
</script>
<template v-slot:prepend>
  <v-icon>mdi-message-text</v-icon>
  <v-row align="center" style="height: 100px;">
    <v-col cols="30">
      <div class="title">Friendly Chat</div>
    </v-col>
  </v-row>
</template>
<style scoped>
.mdi-message-text {
  margin-left: 10rem;
  color: #1131ff;
  font-size: 2.6rem;
}

.title {
  font-family: Helvetica;
  font-size: 2.3rem;
  font-weight: 550;
  text-align: left;
  margin-left: 1rem;
  letter-spacing: -0.08rem;
  color: rgb(17, 49, 255);
}
</style>