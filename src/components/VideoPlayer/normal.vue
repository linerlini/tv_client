/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <div class="video-wrapper" ref="playerNode" id="video" :class="{normal: !isBg}"></div>
</template>
<script setup lang="ts">
import {
  defineProps,
  onMounted,
  withDefaults,
  ref,
  watch,
  toRef,
  reactive,
  watchEffect
} from 'vue'
import Player from 'xgplayer'

const props = withDefaults(
  defineProps<{
    url?: string
    autoplay?: boolean
    playbackRate?: number[]
    needPlayRate?: boolean
    controls?: boolean
    isBg?: boolean
  }>(),
  {
    autoplay: false,
    playbackRate: () => [0.5, 0.75, 1, 1.5, 2],
    needPlayRate: false,
    controls: true,
    isBg: true
  }
)
const url = toRef(props, 'url')
const player = ref<Player>()
const playerNode = ref<HTMLElement>()
const videoSize = reactive({
  width: 0,
  height: 0
})
function initPlayer () {
  if (player.value) {
    player.value.src = url.value!
    return
  }
  player.value = player.value = new Player({
    url: props.url!,
    autoplay: props.autoplay,
    playbackRate: props.needPlayRate ? props.playbackRate : [],
    controls: props.controls,
    width: videoSize.width,
    height: videoSize.height,
    id: 'video',
    cssFullscreen: true
  })
}
// 视图渲染完成后执行里面的函数
onMounted(() => {
  const { offsetWidth, offsetHeight } = playerNode.value!
  videoSize.width = offsetWidth
  videoSize.height = offsetHeight
})
watchEffect(() => {
  if (props.url && playerNode.value) {
    initPlayer()
  } else {
    player.value && player.value.destroy(false)
  }
})
</script>
<style lang="scss" scoped>
.video-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  &.normal {
    z-index: 0;
    pointer-events: unset;
  }
}
</style>
