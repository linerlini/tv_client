<template>
  <div class="video-list">
    <VideoItem
      v-for="(item, index) in props.videos"
      :key="item.uuid"
      :video-info="item"
      :actived="index === props.activedIndex"
      @click="clickHandle(index)"
    ></VideoItem>
  </div>
</template>
<script lang="ts" setup>
import VideoItem from './VideoItem.vue'
import { withDefaults, defineProps, ref, defineEmits } from 'vue'
import { MovieInfo } from '@/types'

const props = withDefaults(
  defineProps<{
    videos: MovieInfo[],
    activedIndex: number,
  }>(),
  {
    activedIndex: 0
  }
)

const emits = defineEmits<{(e: 'activeChange', index: number): void }>()
function clickHandle (index: number) {
  emits('activeChange', index)
}
</script>
<style lang="scss" scoped>
.video-list {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 76px;
  position: absolute;
  bottom: 65px;
}
</style>
