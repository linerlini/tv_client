const path = require('path')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

function parsePath (dir) {
  return path.resolve(__dirname, dir)
}
module.exports = {
  // 选项...
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver({importStyle: false})],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', parsePath('src'))
      .set('router', parsePath('src/router'))
      .set('components', parsePath('src/components'))
      .set('style', parsePath('src/style'))
      .set('views', parsePath('src/views'))
      .set('utils', parsePath('src/utils'))
      .set('server', parsePath('src/server'))
      .set('types', parsePath('src/types'))
      .set('store', parsePath('src/store'))
      .set('config', parsePath('src/config'))
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
    }
  },
}
