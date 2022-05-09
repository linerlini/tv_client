<template>
  <div v-loading="isLoadingData" element-loading-text="Loading..." class="video-warpper">
    <template v-if="!isLoadingData">
      <div class="video-bg">
        <NormalPlayer :url="showVideoURL" autoplay :need-play-rate="false" :controls="false" container="main-content">
        </NormalPlayer>
      </div>
      <div class="content">
        <div class="little-list" v-for="(value, name) in videos" :key="name">
          <div class="list-title">{{ getChineseName(name) }}</div>
          <div class="list">
            <div class="list-item" v-for="item in value" :key="item.uuid">
              <Video :video="item"></Video>
            </div>
          </div>
        </div>
      </div>
      <div class="load-more">
        <el-button @click="loadMore">加载更多</el-button>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {
  getHotVideos,
  getNewVideos,
  getRecommendVideos
} from '@/server/video'
import { ResponseCode } from '@/config/constants'
import 'element-plus/theme-chalk/el-message.css'
import NormalPlayer from 'components/VideoPlayer/normal.vue'
import { MovieInfo, ResponseData } from '@/types'
import Video from 'components/video_item/index.vue'
import { ElMessage } from 'element-plus'

const isLoadingData = ref(true)
const showVideoURL = ref('')
// 视频数据
const videos = reactive<Record<string, MovieInfo[]>>({
  hot: [],
  recommend: [],
  newVideo: []
})
const newVideoOffset = ref(0)
function handleData (data: ResponseData<MovieInfo[]>, type: string) {
  if (data.code === ResponseCode.SUCCESS) {
    videos[type] = type !== 'newVideo' ? data.data.slice(0, 6) : data.data
  }
}
async function initData () {
  try {
    const hotP = getHotVideos()
    const recommendP = getRecommendVideos()
    const newP = getNewVideos(newVideoOffset.value)
    const result = await Promise.all([hotP, recommendP, newP])
    // todo 代码优化
    handleData(result[0]!, 'hot')
    handleData(result[1]!, 'recommend')
    handleData(result[2]!, 'newVideo')
    showVideoURL.value = videos.hot[0].videoUrl!
  } catch (err) { }
  isLoadingData.value = false
}
function getChineseName (name: string) {
  const map: any = {
    hot: '热门视频',
    recommend: '推荐视频',
    newVideo: '最新视频'
  }
  return map[name] || '视频'
}
initData()

const loadingMore = ref(false)
async function loadMore () {
  if (loadingMore.value) {
    ElMessage.info('正在加载中，请稍后')
  } else {
    loadingMore.value = true
    try {
      const newData = await getNewVideos(newVideoOffset.value + 1)
      if (newData?.code === ResponseCode.SUCCESS) {
        newVideoOffset.value += 1
        videos.newVideo = [...videos.newVideo, ...newData.data]
      }
    } catch (err) {
      console.error(err)
      ElMessage.error('加载失败，请重试')
    }
    loadingMore.value = false
  }
}
</script>
<style lang="scss" scoped>
.video-warpper {
  min-height: 100vh;
}

.video-bg {
  height: 80vh;
  width: 100%;
  position: relative;
  margin-bottom: 16px;
}

.content {
  padding: 0 60px;

  .little-list {
    margin-bottom: 64px;

    &:last-child {
      margin-bottom: 16px;
      .list {
        flex-wrap: wrap;

        .list-item {
          margin-bottom: 20px;
        }
      }
    }

    .list-title {
      color: white;
      text-align: left;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .list {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;

      .list-item {
        width: 16%;
      }
    }
  }
}

.load-more {
  margin-bottom: 20px;
}
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
</style>
