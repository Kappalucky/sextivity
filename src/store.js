import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {}, // User details
    partners: [], // Array of Partners User had sex with
    sex: [], // Array of Days User had sex
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPartners(state, val) {
      if (val) {
        state.partners = val;
      } else {
        state.partners = [];
      }
    },
    setSex(state, val) {
      if (val) {
        state.sex = val;
      } else {
        state.sex = [];
      }
    },
  },
  actions: {
    clearData({ commit }) {
      commit('setCurrentUser', null);
      commit('setUserProfile', {});
      commit('setPartners', null);
      commit('setSex', null);
    },
  },
});
