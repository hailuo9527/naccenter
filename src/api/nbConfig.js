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
/* export const deleteNbLists = ({ ids }) => {
  return axios.request({
    url: `/nb/run/delents`,
    method: 'delete',
    params: {
      ids
    }
  })
} */
/*
* status: 1 静态， 0 动态
* */
export const deleteNbLists = ({ nbCode, type, status }) => {
  return axios.request({
    url: `/nb/run/delentname`,
    method: 'delete',
    params: {
      nbCode, type, status
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
export const getNameList = ({ nbCode, type, groupId}) => {
  return axios.request({
    url: '/getAllNameList',
    method: 'post',
    params: {
      nbCode, type, groupId
    }
  })
}
/*
*  获取动态名单信息
* */
export const getAllNameListAuto = ({ nbCode, type, groupId}) => {
  return axios.request({
    url: '/getAllNameListAuto',
    method: 'post',
    params: {
      nbCode, type, groupId
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

/*
*  添加出口
* */
export const addRTRInfo = ({ nbCode, rtrName, rtrMAC, rtrIP }) => {
  return axios.request({
    url: '/addRTRInfo',
    method: 'POST',
    params: {
      nbCode, rtrName, rtrMAC, rtrIP
    }
  })
}

/*
*  获取网络配置里的出口
* */
export const selAllByNbCode = ({ nbCode }) => {
  return axios.request({
    url: '/selAllByNbCode/'+nbCode,
    method: 'GET'
  })
}

/*
*  删除单一条出口
* */
export const delRTR = ({ rtrId }) => {
  return axios.request({
    url: '/delRTR',
    method: 'POST',
    params: {
      rtrId
    }
  })
}

/*
*  修改出口
* */
export const updRTRInfo = ({ rtrId, rtrName, rtrMAC, rtrIP }) => {
  return axios.request({
    url: '/updRTRInfo',
    method: 'POST',
    params: {
      rtrId, rtrName, rtrMAC, rtrIP
    }
  })
}

/*
*  修改分组
* */
export const selRtrRoster = ({ rtrId, nbCode }) => {
  return axios.request({
    url: '/selRtrRoster',
    method: 'POST',
    params: {
      rtrId, nbCode
    }
  })
}
/*
*  修改分组确认
* */
export const addRosterToRTR = ({ rtrId }, rosters ) => {
  return axios.request({
    url: '/addRosterToRTR',
    method: 'POST',
    params: {
      rtrId
    },
    data: rosters
  })
}
/* 
*  搜索静态分组
* */
// export const getAllNameList = ({ nbCode, type, rtrCode }) => {
//   return axios.request({
//     url: '/getAllNameList',
//     method: 'POST',
//     params: {
//       nbCode, type, rtrCode
//     }
//   })
// }
/*
*  添加组名
* */
export const addRGInfo = ({ nbCode, groupName, remark }) => {
  return axios.request({
    url: '/addRGInfo',
    method: 'POST',
    params: {
      nbCode, groupName, remark
    }
  })
}
/*
*  获取名单组管理分组
* */
export const selRGInfoByNbCode = ({ nbCode }) => {
  return axios.request({
    url: '/selRGInfoByNbCode/'+nbCode,
    method: 'GET'
  })
}
/*
*  删除单一条分组
* */
export const delRGInfoById = ({ id }) => {
  return axios.request({
    url: '/delRGInfoById',
    method: 'POST',
    params: {
      id
    }
  })
}
/*
*  分配名单或者网络出口
* */
export const selRGNameList = ({ id, nbCode }) => {
  return axios.request({
    url: '/selRGNameList',
    method: 'POST',
    params: {
      id, nbCode
    }
  })
}
/*
*  分配名单确认
* */
export const addRosterToRGInfo = ({ id }, rosters ) => {
  return axios.request({
    url: '/addRosterToRGInfo',
    method: 'POST',
    params: {
      id
    },
    data: rosters
  })
}
/*
*  分配网络出口确认
* */
export const addRTRToRGInfo = ({ id }, rtrIds ) => {
  return axios.request({
    url: '/addRTRToRGInfo',
    method: 'POST',
    params: {
      id
    },
    data: rtrIds
  })
}
/*
*  修改分组信息
* */
export const updRGInfo = ({ id, nbCode, groupName, remark }) => {
  return axios.request({
    url: '/updRGInfo',
    method: 'POST',
    params: {
      id, nbCode, groupName, remark
    }
  })
}
/*
*  查询所有网络出口信息
* */
export const selRtrAllByRGId = ({ id, nbCode}) => {
  return axios.request({
    url: '/selRtrAllByRGId',
    method: 'POST',
    params: {
      id, nbCode
    }
  })
}