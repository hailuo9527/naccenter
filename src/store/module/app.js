import { getAllNbList } from '../../api/config'
import { selNewMessage } from '../../api/userBind'
export default {
  state: {
    activeNb: null,
    asideList: [],
    applyCount: 0,
  },
  getters: {},
  mutations: {
    setActiveNb (state, item) {
      state.activeNb = item
    },
    setAsideList (state, list) {
      state.asideList = list
    },
    setApplyCount (state, count) {
      state.applyCount = count
    }
  },
  actions: {
    /* getAsideList ({ commit }, refresh) {
       return new Promise((resolve, reject) => {
         getAllNbList().then(res => {
           console.log(res)
           if (res.data.code === 'success') {
             let arr = []
             res.data.result.map((item, index) => {
               console.log(item)
               arr.push(...item.nbInfoList)
             })
             console.log(arr)

             commit('setAsideList', res.data.result)
             // 当前 nbCode不存在时 或者 refresh 为true 时 重置 activeNb
             if (!this.state.app.activeNb || refresh) {
               commit('setActiveNb', res.data.result[0].nbInfoList[0] || { nbCode: 'test' })
             }
             resolve(res)
           }
         }).catch(err => {
           reject(err)
         })
       })
     }*/
    getAsideList ({ commit }, refresh) {
      return new Promise((resolve, reject) => {
        getAllNbList().then(res => {
          //console.log(res)
          if (res.data.code === 'success') {
            let arr = []
            res.data.result.map((item, index) => {
              arr.push(...item.nbInfoList)
            })
            commit('setAsideList', arr)
            // 当前 nbCode不存在时 或者 refresh 为true 时 重置 activeNb
            if (!this.state.app.activeNb || refresh) {
              commit('setActiveNb', arr[0] || { nbCode: 'test' })
            }
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    getApplyCount ({ commit }) {
      return new Promise((resolve, reject) => {
        selNewMessage().then((res) => {
          if (res.data.code === 'success') {
            commit('setApplyCount', res.data.result)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
