import axios from '@/libs/api.request'

/*
* 根据参数返回相应的名单信息
* type 0:固定 1：动态
* */

export const getNameListByType = ({ nbCode, type }) => {
  return axios.request({
    url: '/getNameListByType',
    method: 'post',
    params: {
      nbCode, type
    }
  })
}


/*
* 根据类型查询IP段信息
* */

export const getIpParam = ({ nbCode, type }) => {
  return axios.request({
    url: '/ipmanage/getIpParam',
    method: 'post',
    params: {
      nbCode, type
    }
  })
}

/*
* 获取需要回收的IP
* */

export const getIpRecovery = ({ nbCode }) => {
  return axios.request({
    url: '/ipmanage/getIpRecovery',
    method: 'post',
    params: {
      nbCode
    }
  })
}

/*
* 添加固定IP信息
* */

export const insIpManage = ({ ipManage }) => {
  return axios.request({
    url: '/insIpManage',
    method: 'post',
    data: {
      ipManage
    }
  })
}

/*
* 添加ip段设置
* */

export const insIpParam = ( ipParam ) => {
  return axios.request({
    url: '/insIpParam',
    method: 'post',
    data: ipParam

  })
}

/*
* 插入需要回收的IP
* */

export const insIpRecovery = ({ nbCode, ipAddress }) => {
  return axios.request({
    url: '/insIpRecovery',
    method: 'post',
    params: {
      nbCode, ipAddress
    }
  })
}

/*
* 查询固定IP信息
* */

export const selIpManage = ({ nbCode }) => {
  return axios.request({
    url: '/selIpManage',
    method: 'post',
    params: {
      nbCode
    }
  })
}

/*
* 查询IP段信息
* */

export const selIpParam = ({ nbCode }) => {
  return axios.request({
    url: '/selIpParam',
    method: 'post',
    params: {
      nbCode
    }
  })
}

/*
* 修改固定IP信息
* */

export const uptIpManage = ({ id, ipAddress, macAddress, nbCode }) => {
  return axios.request({
    url: '/uptIpManage',
    method: 'post',
    params: {
      id, ipAddress, macAddress, nbCode
    }
  })
}

/*
* 修改IP段信息
* */

export const uptIpParam = ({ id, ipStart, ipEnd, type, nbCode }) => {
  return axios.request({
    url: '/uptIpParam',
    method: 'post',
    params: {
      id, ipStart, ipEnd, type, nbCode
    }
  })
}
