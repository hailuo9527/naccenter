import axios from '@/libs/api.request'

/*
*  添加系统菜单信息
* */
export const addMenu = ({ treeId, treeName, treePid, treeType, treeCode, remarks }) => {
  return axios.request({
    url: '/sys/tree/add',
    params: {
      treeId, treeName, treePid, treeType, treeCode, remarks
    },
    method: 'post'
  })
}

/*
*  验证菜单Code是否存在接口
* */
export const checkByTreeCode = ({ treeCode }) => {
  return axios.request({
    url: `/sys/tree/checkByTreeCode/${treeCode}`,
    method: 'post'
  })
}

/*
*  验证菜单名称是否存在接口
* */
export const checkByTreeName = ({ treeName }) => {
  return axios.request({
    url: `/sys/tree/checkByTreeName/${treeName}`,
    method: 'post'
  })
}

/*
*  删除菜单信息信息接口
* */
export const delMenu = ({ treeId }) => {
  return axios.request({
    url: `/sys/tree/del/${treeId}`,
    method: 'delete'
  })
}

/*
*  查询所有菜单接口
* */
export const selectAllMenu = ({ treeId }) => {
  return axios.request({
    url: `/sys/tree/selectAll`,
    method: 'get'
  })
}

/*
*  修改菜单信息
* */
export const modifyMenu = ({ treeId, treeName, treePid, treeType, treeCode, remarks }) => {
  return axios.request({
    url: `/sys/tree/update`,
    params: {
      treeId, treeName, treePid, treeType, treeCode, remarks
    },
    method: 'put'
  })
}
