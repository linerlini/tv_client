import { MovieType } from './../config/constants'
import { ResponseData, MovieInfo } from './../types/index'
import server from '.'

export async function getAllMovie () {
  try {
    const result = await server.get<ResponseData<Record<string, MovieInfo[]>>>(
      '/movie/movies',
      {
        params: {
          type: '全部'
        }
      }
    )
    return result.data
  } catch (err) {
    return null
  }
}
export async function getMovieWithType (type: MovieType) {
  try {
    const result = await server.get<ResponseData<MovieInfo[]>>(
      '/movie/movies',
      {
        params: {
          type
        }
      }
    )
    return result.data
  } catch (err) {
    return null
  }
}
