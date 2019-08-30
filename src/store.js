import Vue from 'vue';
import Vuex from 'vuex';

const fb = require('./firebaseConfig.js');

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {}, // User details
    partners: [], // Array of Partners User had sex with
    partnerId: '', // Temporary location for deleting instances
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
    setPartnerId(state, val) {
      state.partnerId = val;
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
      commit('setPartners', []);
      commit('setSex', []);
    },
    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit('setUserProfile', res.data());
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchPartners({ commit, state }) {
      fb.partnersCollection
        .where('userId', '==', state.currentUser.uid)
        .get()
        .then(querySnapshot => {
          const partnersArray = [];
          let index = 0;

          querySnapshot.forEach(doc => {
            const partner = doc.data();
            partner.id = index;
            partnersArray.push(partner);
            index += 1;
          });

          commit('setPartners', partnersArray);
        })
        .catch(err => {
          console.log(err);
        });
    },
    logout({ commit }) {
      commit('clearData');
    },
  },
});

export default store;

// Handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');
    store.dispatch('fetchPartners');

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('setUserProfile', doc.data());
    });
  }
});
