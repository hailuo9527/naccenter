import axios from '@/libs/api.request'

/*
* 登录
* */
export const login = ({ userNo, password }) => {
  return axios.request({
    url: `/user/loginIn`,
    method: 'post',
    params: {
      userNo, password
    }
  })
}
/*
* 登出
* */
export const loginOut = () => {
  return axios.request({
    url: `/user/loginOut`,
    method: 'post'
  })
}

/*
* 注册
* */
export const register = ({ userNo, userName, password, smsCode, openid }) => {
  return axios.request({
    url: `/user/register`,
    method: 'post',
    params: {
      userNo, userName, password, smsCode, openid
    }
  })
}
/*
*  获取验证码
* */

export const getSmsCode = ({ userNo }) => {
  return axios.request({
    url: `/user/getsmsCode`,
    method: 'post',
    params: {
      userNo
    }
  })
}

/*
*  验证用户账号是否存在
* */
export const checkUserNo = ({ userNo }) => {
  return axios.request({
    url: `/user/checkByUserNo`,
    method: 'post',
    params: {
      userNo
    }
  })
}

/*
*  微信绑定账号
* */

export const wxUserBinding = ({ userNo, openid, smsCode }) => {
  return axios.request({
    url: `/user/wxUserBinding`,
    method: 'post',
    params: {
      userNo, smsCode, openid
    }
  })
}

/*
*  微信登录入口
* */

export const wxUserLogin = ({ code, nbCode, ip, mac }) => {
  return axios.request({
    url: `/wxLogin`,
    method: 'post',
    params: { code, nbCode, ip, mac }
  })
}
/*
*  企业管理员转让
* */

export const roleTransfer = ({ userId }) => {
  return axios.request({
    url: `/roleTransfer`,
    method: 'post',
    params: {
      userId
    }
  })
}

/*
*  重置密码
* */

export const getBackPassWord = ({ phoneNumber, codeMsg, password }) => {
  return axios.request({
    url: `/user/getBackPassWord`,
    method: 'post',
    params: {
      phoneNumber, codeMsg, password
    }
  })
}

/*
*  雇员登录使用网络接口
* */

export const addStaffNetworking = ({ staffName, staffTel, staffIP, staffMAC, nbCode, smsCode }) => {
  return axios.request({
    url: `/network/addStaffNetworking`,
    method: 'post',
    params: {
      staffName, staffTel, staffIP, staffMAC, nbCode, smsCode
    }
  })
}
