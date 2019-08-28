import axios from '@/libs/api.request'

/*
*  获取所有Nb list
* */
export const getAllNbList = () => {
  return axios.request({
    url: `/nb/sel/all`,
    method: 'get'
  })
}

/*
* 添加Nb机器信息
* */
export const addNb = ({ nbCode, nbName }) => {
  return axios.request({
    url: `/nb/add`,
    method: 'post',
    params: {
      nbCode, nbName
    }
  })
}

/*
* 删除Nb机器信息
* */
export const delNb = (nbCode) => {
  return axios.request({
    url: `/nb/del/${nbCode}`,
    method: 'delete'
  })
}

/*
* 通过NB序列号查询NB信息接口
* */
export const findNb = (nbName) => {
  return axios.request({
    url: `/nb/selByName/${nbName}`,
    method: 'get'
  })
}

/*
* 将NB机器信息注册到RC系统
* */
export const toRegister = (nbCode) => {
  return axios.request({
    url: `/toRegister/${nbCode}`,
    method: 'get'
  })
}
