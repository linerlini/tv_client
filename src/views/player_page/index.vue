<template>
  <div class="player-wrapper" ref="playerNode" v-loading="!url">
    <NormalPlayer :url="url" autoplay needPlayRate :isBg="false"></NormalPlayer>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import NormalPlayer from 'components/VideoPlayer/normal.vue'
import { useMovieStore } from 'store/index'
import { VideoURLType, ResponseCode } from '@/config/constants'
import { getVideoUrl } from '@/server/video'
import { ElMessage } from 'element-plus'

const store = useMovieStore()
const url = ref<string>('')
watch(() => store.currentPlayingMovie, async (video) => {
  if (!video) {
    return
  }
  try {
    const result = await getVideoUrl(video.uuid, video.videoType as VideoURLType)
    if (result?.code === ResponseCode.SUCCESS) {
      url.value = result.data
    } else {
      ElMessage.error(result?.msg || '获取视频播放地址失败~')
    }
  } catch (err) {
    ElMessage.error('获取视频播放地址失败~')
    console.error(err)
  }
  console.log(url.value)
}, {
  immediate: true
})
</script>
<style scoped lang="scss">
.player-wrapper {
  height: 100vh;
  overflow: hidden;
}
</style>
