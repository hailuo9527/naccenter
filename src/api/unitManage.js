import axios from '@/libs/api.request'

/*
*  根据ip查询
* */
export const getUnitInfoByUser = () => {
  return axios.request({
    url: '/getUnitInfoByUser',
    method: 'post'
  })
}
/*
*  禁用/开启单位
* */
export const enableUnit = ({ id, name, ctime, code, tel, contacts, activation, remarks }) => {
  return axios.request({
    url: '/nc/activation/un',
    method: 'post',
    params: {
      id, name, ctime, code, tel, contacts, activation, remarks
    }
  })
}

/*
*  添加单位
* */
export const addUnit = ({ id, name, ctime, code, tel, contacts, activation, remarks }) => {
  return axios.request({
    url: '/nc/add',
    method: 'post',
    params: {
      id, name, ctime, code, tel, contacts, activation, remarks
    }
  })
}
/*
*  根据id查询
* */
export const selUnit = ({ id }) => {
  return axios.request({
    url: '/nc/list/ip',
    method: 'post',
    params: {
      id
    }
  })
}

/*
*  根据单位名称或者信用代码查询单位信息
* */
export const selUnitUseName = ({ name, code }) => {
  return axios.request({
    url: '/nc/list/un',
    method: 'post',
    params: {
      name, code
    }
  })
}

/*
*  通过Id修改单位信息
* */
export const modifyUnitInfoUseId = ({ id, name, ctime, code, tel, contacts, activation, remarks }) => {
  return axios.request({
    url: '/nc/update/un',
    method: 'put',
    params: {
      id, name, ctime, code, tel, contacts, activation, remarks
    }
  })
}
