import axios from '@/libs/api.request'
/*
* 1.添加白名单,2.添加忽略名单，3.添加阻拦名单
* */
export const addIp = ({ nbCode, type, ipAddress, macAddress, userName }) => {
  return axios.request({
    url: `/nb/run/addip`,
    method: 'post',
    params: {
      nbCode, type, ipAddress, macAddress, userName
    }
  })
}

/*
* 删除名单
* */
export const deleteNbList = ({ id }) => {
  return axios.request({
    url: `/nb/run/delent`,
    method: 'delete',
    params: {
      id
    }
  })
}

/*
* 批量删除名单
* ids: array
* */
/*export const deleteNbLists = ({ ids }) => {
  return axios.request({
    url: `/nb/run/delents`,
    method: 'delete',
    params: {
      ids
    }
  })
}*/
export const deleteNbLists = ({ nbCode, type }) => {
  return axios.request({
    url: `/nb/run/delentname`,
    method: 'delete',
    params: {
      nbCode, type
    }
  })
}
/*
* 通过NB序列号查询配置参数
* */
export const getNbConfig = ({ nbCode }) => {
  return axios.request({
    url: `/nb/run/list`,
    method: 'post',
    params: {
      nbCode
    }
  })
}

/*
* 查询序列号和名单类型
* */
export const getNbType = ({ nbCode, type }) => {
  return axios.request({
    url: `/nb/run/listAll`,
    method: 'post',
    params: {
      nbCode, type
    }
  })
}

/*
* 用户修改NB运行参数
* */
export const changeNbConfig = (data) => {
  return axios.request({
    url: `/nb/run/update`,
    method: 'put',
    params: data
  })
}

/*
* 用户修改网络参数
* */
export const updateNetWork = ({ nbCode, ipaddress, dnsser, ipsubnet, gateway }) => {
  return axios.request({
    url: `/nb/run/updatenetwork`,
    method: 'put',
    params: {
      nbCode, ipaddress, dnsser, ipsubnet, gateway
    }
  })
}
/*
*  获取名单信息
* */
export const getNameList = ({ nbCode, type }) => {
  return axios.request({
    url: '/getAllNameList',
    method: 'post',
    params: {
      nbCode, type
    }
  })
}
/*
*  修改名单使用者名称
* */
export const updNameListById = ({ id, userName }) => {
  return axios.request({
    url: '/updNameListById',
    method: 'put',
    params: {
      id, userName
    }
  })
}
