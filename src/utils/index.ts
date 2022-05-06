export function getEnv () {
  return process.env.NODE_ENV
}

export function throttle (fun: any, delay: number) {
  let last: number
  let deferTimer: any = null
  return function (...args: any) {
    const now = Date.now()
    if (last && now < last + delay) {
      deferTimer && clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(this, args)
      }, last + delay - now)
    } else {
      last = now
      fun.apply(this, args)
    }
  }
}
export function debounce (fun: any, delay: number) {
  return function (...args: any) {
    clearTimeout(fun.id)
    fun.id = setTimeout(function () {
      fun.apply(this, args)
    }, delay)
  }
}

export function openPlayerPage (url: string) {
  window.open(`http://1.14.74.191/player/?url=${url}`)
}
