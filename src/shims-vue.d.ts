/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'xgplayer-hls' {
  const player: any

  export default player
}
declare module 'xgplayer-hls.js' {
  const player: any

  export default player
}
declare module 'dplayer' {
  const player: any
  export const videoPlay: any
  export default player
}
