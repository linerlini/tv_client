<template>
  <div
    v-loading="isLoadingData"
    element-loading-text="Loading..."
    class="movie-wrapper"
  >
    <el-empty v-if="isEmpty"></el-empty>
    <template v-else>
      <div class="video-bg">
        <img :src="topImgUrl" alt="" />
      </div>
      <div class="content">
        <VideoLists
          :videos="movieData!"
          v-show="!movieStore.movieType"
        ></VideoLists>
        <VideoFlow
          :videos="differentTypeMovies[movieStore.movieType]"
          v-show="movieStore.movieType"
        ></VideoFlow>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { MovieInfo } from '@/types'
import { getAllMovie, getMovieWithType } from 'server/movie'
import { ResponseCode } from '@/config/constants'
import VideoLists from 'components/video_lists/index.vue'
import { useMovieStore } from '@/store'
import VideoFlow from 'components/video_flow/index.vue'

const movieStore = useMovieStore()

const isLoadingData = ref(true)
// 是不是没得数据的
const isEmpty = computed(() => {
  const type = movieStore.movieType
  if (type) {
    return !differentTypeMovies.value[type]
  } else {
    return !movieData.value
  }
})
// 就是电影页面那个很大的海报图片地址
const topImgUrl = computed(() => {
  const type = movieStore.movieType
  if (!type) {
    return movieData.value!['热门'] ? movieData.value!['热门'][0].imgUrl : ''
  } else {
    const movies = differentTypeMovies.value[type]
    return movies ? movies[0].imgUrl || '' : ''
  }
})
// 电影数据
const movieData = ref<Record<string, MovieInfo[]>>()
// 不同分类下的电影
const differentTypeMovies = ref<Record<string, MovieInfo[]>>({})
// 初始化电影数据
async function initData () {
  const result = await getAllMovie()
  if (result == null) {
    ElMessage.error('数据获取失败')
  } else {
    if (result.code !== ResponseCode.SUCCESS) {
      ElMessage.info(result.msg)
    } else {
      movieData.value = result.data
      console.log(result.data)
    }
  }
}
// 在页面渲染完后 去初始化数据，同时把加载状态取消了
onMounted(async () => {
  await initData()
  isLoadingData.value = false
})
// 监听电影类型的变化，如果选的和现在的电影类型不一样，就把选的电影类型的数据拿出来
movieStore.$subscribe(async (mutation: any, state: any) => {
  const changeKey = mutation.events.key
  if (changeKey === 'movieType') {
    const type = state.movieType
    if (type && !differentTypeMovies.value[type]) {
      const result = await getMovieWithType(type)
      if (result && result.code === ResponseCode.SUCCESS) {
        differentTypeMovies.value[type] = result.data
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.movie-wrapper {
  min-height: 100vh;
  position: relative;
  :deep(.el-empty) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  > :deep(.el-loading-mask) {
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
.video-bg {
  width: 100%;
  aspect-ratio: 2;
  position: relative;
  margin-bottom: 16px;
  img {
    width: 100%;
    height: 100%;
  }
}
.content {
  padding: 0 60px;
  .little-list {
    margin-bottom: 64px;
    &:last-child {
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
</style>
