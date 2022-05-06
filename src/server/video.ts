import { VideoURLType } from './../config/constants'
import server from '.'
import { ResponseData, MovieInfo } from '@/types'
export async function getHotVideos () {
  try {
    const result = await server.get<ResponseData<MovieInfo[]>>('/video/hot')
    return result.data
  } catch (err) {
    return null
  }
}
export async function getNewVideos (offset = 0) {
  try {
    const result = await server.get<ResponseData<MovieInfo[]>>('/video/new', {
      params: {
        offset
      }
    })
    return result.data
  } catch (err) {
    return null
  }
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
  try {
    const result = await server.get<ResponseData<string>>('/video/url', {
      params: {
        id,
        type
      }
    })
    return result.data
  } catch (err) {
    return null
  }
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
