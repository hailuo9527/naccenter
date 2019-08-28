import { login, loginOut } from '../../api/login'
import { setToken } from '@/libs/util'

export default {
  state: {
    userInfo: {},
    token: ''
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    clearUserInfo (state) {
      state.userInfo = {}
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userNo, password }) {
      return new Promise((resolve, reject) => {
        login({
          userNo,
          password
        }).then(res => {
          if (res.data.code === 'success') {
            const data = res.data.result
            commit('setUserInfo', data)
            commit('setToken', data.token)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLoginOut ({ commit }) {
      return new Promise((resolve, reject) => {
        loginOut().then(res => {
          console.log(res)
          commit('clearUserInfo')
          commit('setToken', '')
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
