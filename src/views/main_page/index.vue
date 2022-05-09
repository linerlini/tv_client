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
      // 获取成功就把视频地址存起来，然后切换这个视频播放
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
/*
  1. 首页视频是怎么做的？
  进入首页，首页还没有开始渲染的时候，先通过axios这个库向服务端的/video/hot发请求，去拿热门视频的信息，同时渲染加载页面，拿到数据后，数据是否有效，无效就渲染空数据页面，有效的话就正常渲染。
  对于视频背景，用到了开源的西瓜播放器这个库，通过设置这个组件的一些属性，最重要的就是传递视频播放地址。置于最底层就是用css的绝对定位，利用z-index层级设置低于其他组件。
  2. 首页视频列表怎么展示的
  拿到数据后，利用vue的v-for这个能力，进行遍历这个视频数组，把视频信息插入到每一个div里面，用css控制div的样式，利用到flex布局，然后监听他们的点击事件，点击到不同的视频，就更换播放器组件里面视频的播放地址。
*/
