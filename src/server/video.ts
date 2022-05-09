import { VideoURLType } from './../config/constants'
import server from '.'
import { ResponseData, MovieInfo } from '@/types'
// 获取热门视频
export async function getHotVideos () {
  const result = await server.get<ResponseData<MovieInfo[]>>('/video/hot')
  return result.data
}
export async function getNewVideos (offset = 0) {
  const result = await server.get<ResponseData<MovieInfo[]>>('/video/new', {
    params: {
      offset
    }
  })
  return result.data
}
export async function getRecommendVideos () {
  try {
    const result = await server.get<ResponseData<MovieInfo[]>>(
      '/video/recommend'
    )
    return result.data
  } catch (err) {
    return null
  }
}
export async function getVideoUrl (id: string, type: VideoURLType) {
  const result = await server.get<ResponseData<string>>('/video/url', {
    params: {
      id,
      type
    }
  })
  return result.data
}
export async function searchVideo (keywords: string) {
  try {
    const result = await server.get<ResponseData<{
      movies: MovieInfo[],
      videos: MovieInfo[]
    }>>('/video/searchVideo', {
      params: {
        keywords
      }
    })
    return result.data
  } catch (err) {
    return null
  }
}
