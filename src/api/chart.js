import axios from '@/libs/api.request'
/*
* 图表
* */

/*
*  获取所有名单信息
* */
export const getAllNameList = ({ nbCode, type }) => {
  return axios.request({
    url: '/getAllNameList',
    method: 'post',
    data: {
      nbCode, type
    }
  })
}

/*
*  获取在线数量
* */
export const getCurrentCount = () => {
  return axios.request({
    url: '/getCurrentCount',
    method: 'post'
  })
}

/*
*  获取当前在线/活跃/入侵主机信息
* */
export const getMasterInfo = ({ nbCode, type }) => {
  return axios.request({
    url: '/getMasterInfo',
    method: 'post',
    params: {
      nbCode, type
    }
  })
}

/*
*  当前网络信息获取
* */
export const getNetworkInfo = ({ nbCode }) => {
  return axios.request({
    url: '/getNetworkInfo',
    method: 'post',
    params: {
      nbCode
    }
  })
}

/*
*   获取学习模式信息
* */
export const getStudyMode = ({ nbCode }) => {
  return axios.request({
    url: '/getStudyModeInfo',
    method: 'post',
    params: {
      nbCode
    }
  })
}

/*
*   获取当前系统状态
* */
export const getSystemStatus = ({ nbCode }) => {
  return axios.request({
    url: '/getSystemStatus',
    method: 'post',
    params: {
      nbCode
    }
  })
}

/*
*   添加机器的资产管理
* */
export const insHostManage = ({ list }) => {
  return axios.request({
    url: '/insHostManage',
    method: 'post',
    data: {
      list
    }
  })
}

/*
*   获取白名单和忽略名单
* */
export const nbGetNameList = ({ nbCode, type }) => {
  return axios.request({
    url: '/getAllNameList',
    method: 'post',
    params: {
      nbCode, type
    }
  })
}

/*
*   存储在线/活跃/入侵主机信息
* */
export const setMasterInfo = ({ nbCode, type, strings }) => {
  return axios.request({
    url: '/setMasterInfo',
    method: 'post',
    data: {
      nbCode, type
    }
  })
}
/*
*   存储当前网络信息

* */
export const setNetworkInfo = ({ networkInfo }) => {
  return axios.request({
    url: '/setNetworkInfo',
    method: 'post',
    data: {
      networkInfo
    }
  })
}

/*
*   存储当前系统状态

* */
export const setSystemStatus = ({ currentSystem }) => {
  return axios.request({
    url: '/setSystemStatus',
    method: 'post',
    data: {
      currentSystem
    }
  })
}

/*
*  资产管理
* */
export const getManagement = ({ nbCode }) => {
  return axios.request({
    url: '/selHostManage',
    method: 'get',
    params: {
      nbCode
    }
  })
}

/*
*  拉取资产数据
*
* */

export const changeStatus = ({ nbCode }) => {
  return axios.request({
    url: '/uptHostManageStaus',
    method: 'get',
    params: {
      nbCode
    }
  })
}
/*
*  重启
*
* */

export const uptHostManageReload = ({ nbCode }) => {
  return axios.request({
    url: '/uptHostManageReload',
    method: 'get',
    params: {
      nbCode
    }
  })
}
/*
*  删除机器资产
* */

export const delHostManage = ({ nbCode }) => {
  return axios.request({
    url: '/delHostManage',
    method: 'get',
    params: {
      nbCode
    }
  })
}

/*
*  修改入侵名单信息
* */

export const uptBlockRoster = ({ nbCode }) => {
  return axios.request({
    url: '/uptBlockRoster',
    method: 'post',
    params: {
      nbCode
    }
  })
}
