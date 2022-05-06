<template>
  <div class="video-item" @click="openVideoCard">
    <img :src="props.video.imgUrl" alt="" loading="lazy" />
  </div>
</template>
<script lang="ts" setup>
import { MovieInfo } from '@/types'
import { defineProps, withDefaults } from 'vue'
import { useMovieStore } from 'store/index'

const movieStore = useMovieStore()

const props = withDefaults(
  defineProps<{
    video: MovieInfo
  }>(),
  {}
)
function openVideoCard () {
  movieStore.bouncedFilmInformation = props.video
  movieStore.movieDialogVisible = true
}
</script>
<style lang="scss" scoped>
.video-item {
  height: 100%;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: scale(2);
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
