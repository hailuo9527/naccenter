import axios from '@/libs/api.request'

/*
*  根据角色Id绑定菜单
* */
export const bindTreeInfoByRoleId = ({ roleId, list }) => {
  return axios.request({
    url: '/bindTreeInfoByRoleId',
    params: {
      roleId
    },
    data: list,
    method: 'post'
  })
}
/*
*  根据角色ID删除
* */
export const delRoleInfo = ({ roleId }) => {
  return axios.request({
    url: '/delRoleInfo',
    params: {
      roleId
    },
    method: 'post'
  })
}

/*
*  根据角色id删除绑定菜单
* */
export const delTreeByRoleId = ({ roleId, list }) => {
  return axios.request({
    url: '/delTreeByRoleId',
    params: {
      roleId
    },
    data: {
      list
    },
    method: 'post'
  })
}

/*
*  根据角色id获取菜单
* */
export const getTreeByRoleId = ({ roleId }) => {
  return axios.request({
    url: '/getTreeByRoleId',
    params: {
      roleId
    },
    method: 'post'
  })
}

/*
*  新增角色信息
* */
export const insRoleInfo = ({ roleName, parentId }) => {
  return axios.request({
    url: '/insRoleInfo',
    params: {
      roleName, parentId
    },
    method: 'post'
  })
}

/*
*  获取所有角色
* */
export const selRoleInfo = () => {
  return axios.request({
    url: '/selRoleInfo',
    method: 'post'
  })
}

/*
*  判断角色名称是否存在
* */
export const selRoleName = ({ roleName, parentId }) => {
  return axios.request({
    url: '/selRoleName',
    method: 'post',
    params: {
      roleName, parentId
    }
  })
}

/*
*  修改角色信息
* */
export const uptRoleInfo = ({ roleName, roleId }) => {
  return axios.request({
    url: '/uptRoleInfo',
    method: 'post',
    params: {
      roleName, roleId
    }
  })
}
