import { VideoURLType } from './../config/constants'
import { MovieInfo, ResponseData } from './../types/index'
import server from './index'

export interface AddCollectRequest {
  movieInfo: MovieInfo;
  account: string;
  type?: VideoURLType
}
export async function addCollect (data: AddCollectRequest) {
  const result = await server.post<ResponseData<null>>('/collect/add', data)
  return result.data
}
interface DeleteCollectRequest {
  account: string,
  id: string,
}
export async function deleteCollect (data: DeleteCollectRequest) {
  const result = await server.get<ResponseData<null>>('/collect/delete', {
    params: data
  })
  return result.data
}
export async function getCollections (account: string) {
  const result = await server.get<ResponseData<MovieInfo[]>>('/collect/get', {
    params: account
  })
  return result?.data || []
}
