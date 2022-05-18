<template>
  <div
    class="main-content"
    v-loading="isLoadingData"
    element-loading-text="Loading..."
    id="main-content"
  >
    <el-empty v-if="videos.length === 0" style="height: 100%"></el-empty>
    <template v-else>
      <NormalPlayer
        :url="currentVideoURL"
        autoplay
        :need-play-rate="false"
        :controls="false"
        container="main-content"
      ></NormalPlayer>
      <VideoLIst :videos="videos" :actived-index="activedIndex" @active-change="activeChangeHandle"></VideoLIst>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getHotVideos, getVideoUrl } from '@/server/video'
import { ResponseCode, VideoURLType } from '@/config/constants'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { MovieInfo } from '@/types'
import NormalPlayer from 'components/VideoPlayer/normal.vue'
import VideoLIst from './components/VideoLIst.vue'
import { useMovieStore } from 'store/index'
import VideoCard from 'components/video_item/VideoCard.vue'

// 获取存储电影的仓库
const movieStore = useMovieStore()
// 声明变量 是否正在加载数据
const isLoadingData = ref(true)
// 活动的索引
const activedIndex = ref(0)
// 视频
const videos = ref<MovieInfo[]>([])
// 计算当前播放的视频地址
const currentVideoURL = computed(() => {
  return videos.value[activedIndex.value].videoUrl
})
// 初始化首页的数据
async function initData () {
  // 获取热门视频
  const result = await getHotVideos()
  if (result.code !== ResponseCode.SUCCESS) {
    // 获取不成功
    ElMessage.error(result?.msg)
  } else {
    // 赋值视频数据
    videos.value = result.data.slice(0, 6)
    // 取消加载状态
    isLoadingData.value = false
  }
}
// 视图渲染开始之前获取数据
initData()
// 视频间切换处理
async function activeChangeHandle (index: number) {
  // 获取当前点击的视频
  const video = videos.value[index]
  if (video.videoUrl) {
    // 如果已经有播放地址了，直接切换这个视频
    activedIndex.value = index
  } else {
    // 没有就先去获取视频地址
    const result = await getVideoUrl(video.uuid, VideoURLType.MV)
    if (result.code !== ResponseCode.SUCCESS) {
      // 获取失败就出提示信息
      ElMessage.error(result?.msg)
    } else {
      // 获取成功就把视频地址存起来并进行视频播放
      video.videoUrl = result?.data
      activedIndex.value = index
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  height: 100vh;
  overflow: hidden;
  position: relative;
  margin-top: -68px;
  :deep(.el-loading-mask) {
    top: 68px;
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
