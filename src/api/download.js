/** download板块接口 */

import axios from '@/libs/api.request'

/**  添加下载的用户信息 */

export const addInstallUserInfo = (json) => {
  return axios.request({
    url: '/addInstallUserInfo',
    method: 'post',
    data: json
  })
}
