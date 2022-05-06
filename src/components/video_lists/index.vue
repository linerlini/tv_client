<template>
  <div class="video-lists">
    <div
      class="list-wrapper"
      v-for="(value, name) in videos"
      :key="name"
      :data-key="name"
      :ref="(el) => {if (el) {listNodes.push(el as any)}}"
    >
      <div class="list-title">{{ name }}</div>
      <div class="list">
        <div
          class="list-item"
          v-for="item in value.slice(0, 6)"
          :key="item.uuid"
          v-loading="!visibleList[name]"
        >
          <Video :video="item" v-if="visibleList[name]"></Video>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Video from 'components/video_item/index.vue'
import { MovieInfo } from '@/types'
import { onMounted, withDefaults, defineProps, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    videos: Record<string, MovieInfo[]>
  }>(),
  {}
)
const visibleList = ref<Record<string, boolean>>({})
const listNodes = ref<HTMLDivElement[]>([])
const stop = watch(
  () => props.videos,
  (val) => {
    if (!val) {
      return
    }
    visibleList.value = Object.keys(val).reduce((pre, item) => {
      pre[item] = false
      return pre
    }, {} as Record<string, boolean>)
    // stop()
  },
  {
    immediate: true
  }
)
let observe: IntersectionObserver | null = null
function intersectionHandle (entry: IntersectionObserverEntry[]) {
  if (Array.isArray(entry)) {
    entry.forEach((item) => {
      const key = (item.target as HTMLDivElement).dataset.key!
      visibleList.value[key] = true
      // eslint-disable-next-line no-unused-expressions
      observe?.unobserve(item.target)
    })
  }
}
onMounted(() => {
  observe = new IntersectionObserver(intersectionHandle)
  listNodes.value.forEach((node) => observe?.observe(node))
})
</script>
<style lang="scss" scoped>
.video-lists {
  .list-wrapper {
    margin-bottom: 64px;
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
        min-height: 100px;
      }
    }
  }
}
</style>
