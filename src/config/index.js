export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'NacCenter',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  // cookieExpires: 1 / 48,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://192.168.1.239:8070',
    // dev: 'http://app.wingsbro.com:8070',
    // dev: 'http://wingsbro.mynetgear.com:8070',
    // pro: 'http://wingsbro.mynetgear.com:8070',
    pro: 'http://app.wingsbro.com:8070'
  },
  /*微信配置*/
  wxConfig: {
    self_redirect:false,
    id:'qrcode',
    appid:'wx243ad0422689c414',
    scope:'snsapi_login',
    redirect_uri: window.location.href +'?code=CODE&state=STATE',
    state:'1211111',
    style:'black',
    href:'',
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
  }
}
