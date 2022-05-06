import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state () {
    return {
      userName: '',
      account: '',
      uuid: '',
      password: '',
      createdAt: '',
      updatedAt: '',
      isLogin: false
    }
  }
})

// todo 类型
export const useMovieStore = defineStore<any, any, any>('movie', {
  state () {
    return {
      movieType: undefined,
      searchKeywords: '',
      bouncedFilmInformation: null,
      movieDialogVisible: false,
      collectMovie: [],
      currentPlayingMovie: null
    }
  }
})
