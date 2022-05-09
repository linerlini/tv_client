<template>
  <div
    class="search-wrapper"
  >
    <div class="list-wrapper" v-if="movieStore.collectMovie">
      <div class="list-title">我的收藏</div>
      <div class="movie-list list">
        <div v-for="item in movieStore.collectMovie" :key="item.uuid">
          <Video :video="item"></Video>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useMovieStore } from '@/store'
import 'element-plus/theme-chalk/el-message.css'
import Video from 'components/video_item/index.vue'

const movieStore = useMovieStore()
</script>
<style lang="scss" scoped>
.search-wrapper {
  padding: 38px 54px;
  min-height: calc(100vh - 68px);
  .list-title {
    font-size: 18px;
    color: grey;
    text-align: left;
    margin-bottom: 16px;
  }
  .list {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    > div {
      width: 16%;
      height: 160px;
      background: white;
      margin-bottom: 78px;
    }
  }
  // todo 样式重复
  :deep(.el-loading-mask) {
    background: #141414;
    color: #e50914;
    circle {
      stroke: #e50914;
    }
    .el-loading-text {
      color: #e50914;
    }
  }
}
</style>
