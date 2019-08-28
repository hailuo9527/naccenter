// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'

import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import * as vueExpand from '@/libs/vue-expand'

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

Vue.use(iView, {
})

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)


/**
 * 生成常用方法
 */
Object.keys(vueExpand).forEach(key => {
  Vue.prototype[key] = vueExpand[key]
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
