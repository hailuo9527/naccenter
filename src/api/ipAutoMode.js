import axios from '@/libs/api.request'

/*
* 获取自动分配IP段
* */

export const getIpAutoMode = () => {
  return axios.request({
    url: '/getIpAutoMode',
    method: 'post',
  })
}

/*
* 自动分配IP段
* */

export const setIpAutoMode = ({ mask, groupId }) => {
  return axios.request({
    url: '/setIpAutoMode',
    method: 'post',
    params: {
      mask, groupId
    }
  })
}

