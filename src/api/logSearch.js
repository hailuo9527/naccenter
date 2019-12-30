import axios from '@/libs/api.request'

/*
* 获取选择器内容
* */
export const selLogSubMoudle = () => {
  return axios.request({
    url: '/selLogSubMoudle',
    method: 'post'
  })
}

/*
* 获取查询的日志
* */
export const selTsystemLog = ({ nbCode, userName, submoudle, startTime, endTime, pageNo, pageSize }) => {
  return axios.request({
    url: '/selTsystemLog',
    method: 'post',
    params: {
      nbCode, userName, submoudle, startTime, endTime, pageNo, pageSize
    }
  })
}
