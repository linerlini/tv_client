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

const movieStore = useMovieStore()
const isLoadingData = ref(true)
const activedIndex = ref(0)
const videos = ref<MovieInfo[]>([])
const currentVideoURL = computed(() => {
  return videos.value[activedIndex.value].videoUrl
})
async function initData () {
  const result = await getHotVideos()
  if (!result) {
    return
  }
  if (result.code !== ResponseCode.SUCCESS) {
    ElMessage.error(result?.msg)
  } else {
    videos.value = result.data.slice(0, 6)
    isLoadingData.value = false
  }
}
initData()

async function activeChangeHandle (index: number) {
  const video = videos.value[index]
  if (video.videoUrl) {
    activedIndex.value = index
  } else {
    const result = await getVideoUrl(video.uuid, VideoURLType.MV)
    if (result?.code !== ResponseCode.SUCCESS) {
      ElMessage.error(result?.msg)
    } else {
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
