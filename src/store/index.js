import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store =  new Vuex.Store({
  state: {
    isLoggedIn: false,
  },
  mutations: {
    setLoginState(state, status) {
      state.isLoggedIn = status;
    },
  },
  actions: {
    checkLoginStatus({ commit }) {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
      commit('setLoginState', !!token);
    },
    async login({ commit }, token) {
      commit('setLoginState', true);
      document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    },
    logout({ commit }) {
      document.cookie = 'access_token=; path=/; max-age=0';
      commit('setLoginState', false);
    },
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
  },
});

export default store;