<template>
  <div class="home">
    <Header></Header>
    <RouterView></RouterView>
    <el-dialog
      v-model="movieStore.movieDialogVisible"
      custom-class="video-card"
      width="70%"
    >
      <VideoCard :video="movieStore.bouncedFilmInformation"></VideoCard>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import Header from 'components/header/index.vue'
import { RouterView } from 'vue-router'
import { useMovieStore } from 'store/index'

const movieStore = useMovieStore()
</script>
<style lang="scss" scoped>
.home {
  position: relative;
}
:deep(.video-card) {
  background-color: #181818;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
