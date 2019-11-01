import axios from '@/libs/api.request'
import { getToken } from '../libs/util'

/* 检查用户需要升级的NacBOX  */
export const checkVersion = () => {
  return axios.request({
    url: '/checkVersion',
    method: 'post'
  })
}

/* 获取NacBox最新版本介绍公告  */
export const selLatestEdition = () => {
  return axios.request({
    url: '/selLatestEdition',
    method: 'post'
  })
}

/* 批量更新NacBOX版本
*  nbCodes: arr
*  */
export const updatVersionToNB = (nbCodes) => {
  return axios.request({
    url: '/updatVersionToNB',
    method: 'post',
    data: nbCodes
  })
}
