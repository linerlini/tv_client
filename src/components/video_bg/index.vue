/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <div class="video-bg-wrapper">
    <div class="video-bg" ref="playerNode" id="video"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

</script>
<style lang="scss" scoped>
.video-bg-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  // z-index: -1;
}
</style>
