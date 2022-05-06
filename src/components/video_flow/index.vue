<template>
  <div class="video-flow">
    <div class="item" v-for="item in props.videos" :key="item.uuid">
      <Video :video="item"></Video>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MovieInfo } from '@/types'
import { withDefaults, defineProps } from 'vue'
import Video from 'components/video_item/index.vue'

const props = withDefaults(
  defineProps<{
    videos: MovieInfo[]
  }>(),
  {
    videos: () => []
  }
)
</script>
<style lang="scss" scoped>
.video-flow {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  .item {
    width: 16%;
    min-height: 100px;
    max-height: 160px;
    flex-shrink: 0;
    margin-bottom: 20px;
    margin-right: 16px;
  }
}
</style>
