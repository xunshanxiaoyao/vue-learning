import Vue from 'vue'
import Vuex from './lvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state) {
      state.count++
    }
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('add')
      }, 1000)
    }
  },
  modules: {
  },
  getters: {
    double(state) {
      return state.count * 2
    }
  }
})
