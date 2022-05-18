<template>
  <div class="home">
    <Header></Header>
    <RouterView></RouterView>
    <!--视频卡片在这里 el-dialog是一个弹窗 弹窗的内容就是一个视频卡片-->
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
