import { MovieInfo, ResponseData, User } from './../types/index'
import server from '.'

export type LoginResponse = {
  userInfo: User,
  collections: MovieInfo[]
}
export async function login (account: string, password: string) {
  const result = await server.post<ResponseData<LoginResponse>>('/user/login', {
    account,
    password
  })
  return result.data
}
export async function register (
  account: string,
  password: string,
  userName: string
) {
  const result = await server.post<ResponseData<User>>('/user/register', {
    account,
    password,
    userName
  })
  return result.data
}
export async function requestAutoLogign () {
  const result = await server.get<ResponseData<User>>('/user/auto')
  return result.data
}
export async function refreshToken () {
  const result = await server.get<ResponseData<null>>('/user/refresh')
  return result.data
}
export async function requestLoginOut () {
  const result = await server.get<ResponseData<null>>('/user/logout')
  return result.data
}
