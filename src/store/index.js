import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// import user from './module/user'
import app from './module/app'
import login from './module/login'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    // user,
    app,
    login
  },
  plugins: [createPersistedState()]
})
