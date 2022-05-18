import { useUserStore } from 'store/index'
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import axiosRetry from 'axios-retry'
import { ResponseCode } from '@/config/constants'
import { refreshToken } from './user'
interface Interceptors {
  // 请求拦截
  requestInterceptors?: Array<
    (config: AxiosRequestConfig) => AxiosRequestConfig
  >;
  requestInterceptorsCatch?: Array<(err: any) => any>;
  // 响应拦截
  responseInterceptors?: Array<
    (config: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  >;
  responseInterceptorsCatch?: Array<(err: any) => any>;
}
function useInterceptors (
  axiosInstance: AxiosInstance,
  interceptors?: Interceptors
) {
  if (!interceptors) {
    return
  }
  if (Array.isArray(interceptors.requestInterceptors)) {
    interceptors.requestInterceptors.forEach((func) =>
      axiosInstance.interceptors.request.use(func)
    )
  }
  if (Array.isArray(interceptors.requestInterceptorsCatch)) {
    interceptors.requestInterceptorsCatch.forEach((func) =>
      axiosInstance.interceptors.request.use(undefined, func)
    )
  }
  if (Array.isArray(interceptors.responseInterceptors)) {
    interceptors.responseInterceptors.forEach((func) =>
      axiosInstance.interceptors.response.use(func)
    )
  }
  if (Array.isArray(interceptors.responseInterceptorsCatch)) {
    interceptors.responseInterceptorsCatch.forEach((func) =>
      axiosInstance.interceptors.response.use(undefined, func)
    )
  }
}
function handleAxiosError (error: AxiosError) {
  if (error.response) {
    return {
      data: {
        code: ResponseCode.RESPONSE_ERROR,
        data: null,
        msg: '请求错误，请联系管理员'
      }
    }
  }
  if (error.request) {
    return {
      data: {
        code: ResponseCode.NETWORK_ERROR,
        data: null,
        msg: '网络出错，请检查您的网络状况'
      }
    }
  }
  return {
    data: {
      code: ResponseCode.NETWORK_ERROR,
      data: null,
      msg: '写错了个人看哈'
    }
  }
}
const createAxiosInstance = (
  config: AxiosRequestConfig,
  interceptors?: Interceptors
) => {
  const instance = axios.create(config)
  instance.interceptors.response.use(undefined, (error) => {
    console.error(error)
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error)
    }
    return {
      data: {
        code: ResponseCode.RESPONSE_ERROR,
        data: null,
        msg: '未知错误'
      }
    }
  })
  instance.interceptors.request.use(undefined, (error) => {
    console.error(error)
    return {
      data: {
        code: ResponseCode.RESPONSE_ERROR,
        data: null,
        msg: '未知错误'
      }
    }
  })
  // 请求重试
  axiosRetry(instance, { retries: 3 })
  useInterceptors(instance, interceptors)
  return instance
}

const server = createAxiosInstance(
  {
    baseURL: '/api'
  },
  {
    responseInterceptors: [
      async (config) => {
        const { data } = config
        if (data?.code === ResponseCode.TOKEN_OUT) {
          const store = useUserStore()
          if (store.isLogin) {
            const refreshResult = await refreshToken()
            if (refreshResult.code !== ResponseCode.SUCCESS) {
              return config
            }
            const result = await server(config.config)
            return {
              ...config,
              data: result.data
            }
          }
          window.location.replace('/')
        }
        return config
      }
    ]
  }
)

export default server
