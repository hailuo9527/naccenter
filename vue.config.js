const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const TEST_URL = process.env.NODE_ENV === 'production'
  ? 'http://wingsbro.mynetgear.com:8081'
  : '/'
/*const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://nc.wingsbro.com'
  : '/'*/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : '/'
module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('~', resolve('public'))

   /* config.module.rule('compile')
      .test(/\.js$/)
      .include
      .add(resolve('src'))
      .add(resolve('/node_modules/'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', {
            modules: false
          }]
        ]
      });*/

  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
  // devServer: {
  //   proxy: {
  //     '': {
  //       target: 'http://192.168.1.126:8080', // 接口服务器域名地址
  //       changeOrigin: true
  //     }
  //   }
  // }
  devServer: {
   // https: true
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,
  transpileDependencies: [
    'iview',
    'axios',
    /vue-particles/
  ],
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {

      return {
        performance: {
          hints:'warning',
          //入口起点的最大体积 整数类型（以字节为单位）
          maxEntrypointSize: 100000000,
          //生成文件的最大体积 整数类型（以字节为单位 300k）
          maxAssetSize: 30000000,
          //只给出 js 文件的性能提示
          assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js');
          },

        },
        optimization: {
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 20000,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name (module) {
                  // get the name. E.g. node_modules/packageName/not/this/part.js
                  // or node_modules/packageName
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `npm.${packageName.replace('@', '')}`
                }
              }
            }
          },
        },
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css/,
            threshold: 10240, // 对超过10kb的数据压缩
            deleteOriginalAssets: false //是否删除原文件
          }),
          new UglifyPlugin({
            uglifyOptions: {
              compress: {
                //warnings: false,
                drop_console: true, // console
                drop_debugger: false,
                pure_funcs: ['console.log'] // 移除console
              }
            }
          })
        ]
      }
    }
  }
}
