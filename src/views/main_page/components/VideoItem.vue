<template>
  <div class="video-item-wrapper">
    <div class="action-buttons" v-show="actived">
      <div class="player-button" @click="playVideo">
        <el-icon :size="35">
          <caret-right />
        </el-icon>
      </div>
      <div class="info-button" @click="openVideoCard">
        <el-icon :size="35" color="white">
          <arrow-down-bold />
        </el-icon>
      </div>
    </div>
    <div class="video-item" @click="clickHandle">
      <img :src="props.videoInfo.imgUrl" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MovieInfo } from '@/types'
import { withDefaults, defineProps, computed, defineEmits } from 'vue'
import { CaretRight, ArrowDownBold } from '@element-plus/icons-vue'
import { useMovieStore } from 'store/index'
import { useRouter } from 'vue-router'
import { RouteName } from '@/router'
// 电影仓库
const movieStore = useMovieStore()
// 获取使用路由的工具
const router = useRouter()
// 设置这个组件的属性
const props = withDefaults(
  defineProps<{
    videoInfo: MovieInfo
    actived: boolean
  }>(),
  {
    actived: false
  }
)
// 定义这个组件能触发什么事件 props和emit都可以参考vue3官网
const emits = defineEmits<{(e: 'click'): void }>()
// 点击事件处理
function clickHandle () {
  if (props.actived) {
    return
  }
  emits('click')
}
// computed计算属性，就是传的函数里，如果用到的东西有会变化，会重新计算
const borderColor = computed(() => (props.actived ? 'white' : '#5e5d5b'))

// 打开video card
function openVideoCard () {
  movieStore.bouncedFilmInformation = props.videoInfo
  movieStore.movieDialogVisible = true
}
// 播放
function playVideo () {
  movieStore.currentPlayingMovie = props.videoInfo
  router.push({ name: RouteName.PLAYER })
}
</script>
<style lang="scss" scoped>
.video-item-wrapper {
  background: transparent;
  border-top: 2px solid v-bind(borderColor);
  padding-top: 14px;
  margin-right: 5px;
  flex: 1;
  .video-item {
    img {
      width: 100%;
    }
    cursor: pointer;
    margin-bottom: 14px;
  }
  .action-buttons {
    display: flex;
    margin-bottom: 10px;
    > div {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      position: relative;
      margin-left: 8px;
      cursor: pointer;
      :deep(.el-icon) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .player-button {
      background-color: white;
    }
    .info-button {
      background-color: transparent;
    }
  }
}
</style>
