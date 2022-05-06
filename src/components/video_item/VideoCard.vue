<template>
  <div class="card-wrapper">
    <div class="card-img">
      <img :src="props.video.imgUrl" />
      <div class="action-buttons">
        <el-button plain @click="playMovie">
          <el-icon>
            <caret-right />
          </el-icon>播放
        </el-button>
        <el-icon color="white" :size="40" @click="collectMovies">
          <circle-plus />
        </el-icon>
      </div>
    </div>
    <div class="video-info">
      <div class="video-title">
        <span>标题:</span>
        {{ props.video.name }}
      </div>
      <div class="more-info">
        <div v-show="props.video.actors">
          <span>演员:</span>
          {{ props.video.actors }}
        </div>
        <div v-show="props.video.director">
          <span>导演:</span>
          {{ props.video.director }}
        </div>
        <div v-show="props.video.time">
          <span>上映:</span>
          {{ props.video.time }}
        </div>
        <div v-show="props.video.type">
          <span>类型:</span>
          {{ props.video.type }}
        </div>
      </div>
      <div class="movie-desc">{{ props.video.desc }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MovieInfo } from '@/types'
import { defineProps, ref, withDefaults, watch } from 'vue'
import { CaretRight, CirclePlus } from '@element-plus/icons-vue'
import { useMovieStore, useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { openPlayerPage } from '@/utils'
import { useRouter } from 'vue-router'
import { RouteName } from '@/router'
import { addCollect, deleteCollect, AddCollectRequest } from '@/server/collect'
import { ResponseCode, VideoURLType } from '@/config/constants'

const userStore = useUserStore()
const movieStore = useMovieStore()
const router = useRouter()
const props = withDefaults(
  defineProps<{
    video: MovieInfo
  }>(),
  {}
)

const hasCollected = ref(false)
const handling = ref(false)
watch(() => props.video, (value) => {
  if (value && (movieStore.collectMovie as MovieInfo[]).find((item) => item.uuid === value.uuid)) {
    hasCollected.value = true
  } else {
    hasCollected.value = false
  }
}, { immediate: true })
async function collectMovies () {
  if (handling.value) {
    ElMessage.info('正在处理中，请稍后')
    return
  }
  try {
    if (hasCollected.value) {
      const data = await deleteCollect({
        account: userStore.account,
        id: props.video.uuid
      })
      if (data.code === ResponseCode.SUCCESS) {
        hasCollected.value = false
        const temp: MovieInfo[] = movieStore.collectMovie.slice()
        const index = temp.findIndex((item) => item.uuid === props.video.uuid)
        temp.splice(index, 1)
        movieStore.collectMovie = temp
        ElMessage.success('取消收藏成功')
      } else {
        ElMessage.error(data.msg)
      }
    } else {
      const requestData: AddCollectRequest = {
        account: userStore.account,
        movieInfo: props.video
      }
      props.video.videoType && (requestData.type = props.video.videoType as VideoURLType)

      const data = await addCollect(requestData)
      if (data.code === ResponseCode.SUCCESS) {
        hasCollected.value = true
        movieStore.collectMovie.push(props.video)
        ElMessage.success('收藏成功')
      } else {
        ElMessage.error(data.msg)
      }
    }
  } catch (err) {
    console.error(err)
  }
  handling.value = false
}

async function playMovie () {
  const { video } = props
  if (!video.videoType) {
    openPlayerPage(video.videoUrl!)
  } else {
    movieStore.currentPlayingMovie = video
    router.push({ name: RouteName.PLAYER })
  }
}
</script>
<style lang="scss" scoped>
.card-wrapper {
  border-radius: 6px;
  overflow: hidden;

  .card-img {
    margin-bottom: 20px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      background: linear-gradient(to top, #181818, transparent 50%);
    }

    img {
      width: 100%;
    }
  }

  .action-buttons {
    position: absolute;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    bottom: 30px;
    left: 48px;

    :deep(.el-button) {
      width: 107px;
      height: 40px;
      background: white;
      margin-right: 10px;
      cursor: pointer;
    }
  }

  .video-info {
    padding: 0 48px;
    color: white;
    font-size: 14px;

    .video-title {
      text-align: left;
      margin-bottom: 20px;
      font-size: 20px;

      span {
        color: #777;
        font-size: 14px;
      }
    }

    .more-info {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;

      >div {
        flex-basis: 47%;
        flex-shrink: 0;
        text-align: left;
        margin-bottom: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        span {
          color: #777;
        }
      }
    }

    .movie-desc {
      font-size: 18px;
      text-align: left;
    }
  }
}
</style>
