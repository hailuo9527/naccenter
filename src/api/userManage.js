import axios from '@/libs/api.request'

/*
*  添加用户角色
* */
export const insUserRole = ({ userNo, userName, password, parentId, activation }) => {
  return axios.request({
    url: '/insUserRole',
    params: {
      userNo, userName, password, parentId, activation
    },
    method: 'post'
  })
}

/*
*  移除用户角色
* */
export const removeUserRole = ({ userId }) => {
  return axios.request({
    url: '/removeUserRole',
    params: {
      userId
    },
    method: 'get'
  })
}

/*
*  重置密码
* */
export const rewordPassword = ({ userNo, password }) => {
  return axios.request({
    url: '/rewordPassword',
    params: {
      userNo, password
    },
    method: 'post'
  })
}

/*
*  查询用户信息
* */
export const selUserInfo = ({ userName }) => {
  return axios.request({
    url: '/selUserInfo',
    params: {
      userName
    },
    method: 'get'
  })
}
/*
*  修改用户信息
* */
export const updateUser = ({ userNo, userName, password, parentId, activation, roleId, userId }) => {
  return axios.request({
    url: '/updateUser',
    params: {
      userNo, userName, password, parentId, activation, roleId, userId
    },
    method: 'get'
  })
}
/*
*  新增用户信息
* */
export const insUser = ({ userNo, userName, password, parentId, activation, roleId, userId }) => {
  return axios.request({
    url: '/insUser',
    params: {
      userNo, userName, password, parentId, activation, roleId, userId
    },
    method: 'get'
  })
}

/*
*  修改用户角色
* */
export const uptUserRole = ({ userNo, roleId }) => {
  return axios.request({
    url: '/uptUserRole',
    params: {
      userNo, roleId
    },
    method: 'get'
  })
}

/*
*  修改用户状态
* */
export const uptUserStatus = ({ userNo, activation }) => {
  return axios.request({
    url: '/uptUserStatus',
    params: {
      userNo, activation
    },
    method: 'get'
  })
}
