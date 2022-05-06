import { ResponseCode } from '@/config/constants'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from 'store/index'
import Home from 'views/Home.vue'
import { requestAutoLogign } from '@/server/user'

export const enum RouteName {
  HOME = 'Home',
  MAIN = 'main',
  LOGIN = 'login',
  MOVIE = 'movie',
  VIDEO = 'video',
  SEARCH = 'search',
  COLLECT = 'collect',
  PLAYER = 'player'
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: RouteName.HOME,
    component: Home,
    async beforeEnter () {
      const store = useUserStore()
      if (!store.isLogin) {
        const result = await requestAutoLogign()
        if (result.code === ResponseCode.SUCCESS) {
          const userInfo = result.data
          store.$state = {
            ...userInfo,
            isLogin: true
          }
        } else {
          router.push({
            name: RouteName.LOGIN
          })
        }
      }
    },
    redirect: '/home/main',
    children: [
      {
        path: 'main',
        name: RouteName.MAIN,
        component: () => import('views/main_page/index.vue')
      },
      {
        path: 'movie',
        name: RouteName.MOVIE,
        component: () => import('views/movie_page/index.vue')
      },
      {
        path: 'search',
        name: RouteName.SEARCH,
        component: () => import('views/search_page/index.vue')
      },
      {
        path: 'video',
        name: RouteName.VIDEO,
        component: () => import('views/video_page/index.vue')
      },
      {
        path: 'collect',
        name: RouteName.COLLECT,
        component: () => import('views/collect_page/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: RouteName.LOGIN,
    component: () => import('views/login_page/index.vue')
  },
  {
    path: '/player',
    name: RouteName.PLAYER,
    component: () => import('views/player_page/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
