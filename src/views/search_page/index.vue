<template>
  <div
    class="search-wrapper"
    v-loading="isLoadding"
    element-loading-text="Loading..."
  >
    <div class="list-wrapper" v-if="movies.length">
      <div class="list-title">发掘于以下字词有关的电影</div>
      <div class="movie-list list">
        <div v-for="item in movies" :key="item.uuid">
          <Video :video="item"></Video>
        </div>
      </div>
    </div>
    <div class="list-wrapper" v-if="videos.length">
      <div class="list-title">发掘于以下字词有关的视频</div>
      <div class="video-list list">
        <div v-for="item in videos" :key="item.uuid">
          <Video :video="item"></Video>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useMovieStore } from '@/store'
import { searchVideo } from 'server/video'
import { MovieInfo } from '@/types'
import { ResponseCode } from '@/config/constants'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { debounce } from 'utils/index'
import Video from 'components/video_item/index.vue'

const movieStore = useMovieStore()
// debounce防抖，阔以百度下前端防抖，这个函数就是搜素功能
const searchVideos = debounce(async (keywords: string) => {
  // 搜素的时候，把加载状态拿出来
  isLoadding.value = true
  try {
    const result = await searchVideo(keywords)
    if (result?.code === ResponseCode.SUCCESS) {
      // 搜素成功，就展示
      movies.value = result.data.movies || []
      videos.value = result.data.videos || []
    } else {
      // 不成功 出提示信息
      ElMessage.error(result?.msg)
    }
  } catch (err) {}
  // 结束加载状态
  isLoadding.value = false
}, 200)
// 监听搜索关键词的变化。变了就搜索
movieStore.$subscribe((mutation: any, state: any) => {
  const { searchKeywords } = state
  searchVideos(searchKeywords)
})
const isLoadding = ref(false)
const movies = ref<MovieInfo[]>([])
const videos = ref<MovieInfo[]>([])
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
