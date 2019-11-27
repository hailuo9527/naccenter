import axios from 'axios'

import { getToken, removeToken } from './util'
// import { Spin } from 'iview'
axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest' // 设置该请求头用于服务器判断是否Ajax请求

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        AUTHORIZATION: getToken()

        // 'Accept-Encoding': 'gzip'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      switch (error.response.status) {
        case 401:
          /** 无权限访问 **/
          console.log()
          window.location.href = '/401'
          break
        case 403:
          console.log('token已失效')
          removeToken()
          window.location.href = '/login'
          if (typeof error.response.data.code !== 'undefined') {
            return error.response.data
          }
          break
        case 404:
          window.location.href = '/404'
      }
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      // addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
