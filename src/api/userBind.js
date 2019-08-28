import axios from '@/libs/api.request'

/*
*  用户绑定用户申请
* */
export const userApplyBind = ({ nbCode, applyReason }) => {
  return axios.request({
    url: '/flow/applyBind',
    params: {
      nbCode, applyReason
    },
    method: 'post'
  })
}

/*
*  用户审核用户申请
* */
export const checkUserApplyBind = ({ state, auditReason, flowId }) => {
  return axios.request({
    url: '/flow/auditBind',
    params: {
      state, auditReason, flowId
    },
    method: 'post'
  })
}

/*
*  查询所有与用户有关的流程
* */
export const getAllUserFlow = () => {
  return axios.request({
    url: '/flow/selFlowInfo',
    method: 'get'
  })
}

/*
*  待办事项
* */
export const selNewMessage = () => {
  return axios.request({
    url: '/flow/selNewMessage',
    method: 'get'
  })
}
