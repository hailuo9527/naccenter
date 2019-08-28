import axios from '@/libs/api.request'

/*
获取当前活跃名单总数
*/
export const getActiveHostCount = () => {
  return axios.request({
    url: '/sysOverview/getActiveHostCount',
    method: 'get'
  })
}
/*
*  获取NB在线总量
* */
export const getOnLineTotal = () => {
  return axios.request({
    url: '/sysOverview/onLineTotal',
    method: 'get'
  })
}
/*
*  获取用户配置的各类名单总数
*  存储在线/活跃/入侵主机信息1/2/3
*  白名单/忽略名单 4/5
* */

export const getRosterSum = (rosterType) => {
  return axios.request({
    url: `/sysOverview/rosterSum/${rosterType}`,
    method: 'get'
  })
}

/*
*  获取入侵名单总数
* */

export const getBlockHostCount = () => {
  return axios.request({
    url: `/sysOverview/getBlockHostCount`,
    method: 'get'
  })
}
