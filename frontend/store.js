import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    key: 'abc'
  },
  mutations: {
    setKey(state, payload) {
      if (payload.key != '') {
        state.key = payload.key;
      }
    }
  }
});