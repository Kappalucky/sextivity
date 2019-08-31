/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

const fb = require('./firebaseConfig.js');

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    authStatus: '',
    authError: '',
    currentUser: null,
    userProfile: {}, // User details
    partners: [], // Array of Partners User had sex with
    partner: {}, // Single Partner instance details
    partnerId: null, // Single Partner instance UID
    realTimePartners: [], // Array to handle incoming updates to Partner Collection
    sex: [], // Array of Days User had sex
    error: '',
  },
  mutations: {
    AUTH_REQUEST(state) {
      state.authStatus = 'Loading';
    },
    AUTH_SUCCESS(state, payload) {
      state.authStatus = 'Success';
      this.commit('SET_CURRENT_USER', payload);
      state.authError = '';
      state.error = '';
    },
    AUTH_ERROR(state, payload) {
      state.authStatus = 'Error';
      state.authError = payload;
    },
    SET_CURRENT_USER(state, payload) {
      state.currentUser = payload;
    },
    SET_USER_PROFILE(state, payload) {
      state.userProfile = payload;
    },
    SET_PARTNERS(state, payload) {
      if (payload) {
        state.partners = payload;
      } else {
        state.partners = [];
      }
    },
    SET_PARTNER(state, payload) {
      state.partner = payload;
    },
    SET_PARTNER_ID(state, payload) {
      state.partnerId = payload;
    },
    SET_SEX(state, payload) {
      if (payload) {
        state.sex = payload;
      } else {
        state.sex = [];
      }
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    NEW_PARTNER(state, payload) {
      state.partners.push(payload);
    },
    DELETE_PARTNER(state, partnerId) {
      const newObject = state.partners.filter(
        partner => partner.id !== partnerId,
      );
      state.partners = newObject;
    },
    LOGOUT(state) {
      state.error = '';
      state.authStatus = '';
      state.authError = '';
      this.commit('setCurrentUser', null);
      this.commit('setUserProfile', {});
      this.commit('setPartners', []);
      this.commit('setPartnerId', null);
      this.commit('setSex', []);
    },
  },
  actions: {
    loginWithEmail({ dispatch, commit }, { email, password }) {
      commit('AUTH_REQUEST');
      fb.auth
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          commit('AUTH_SUCCESS', response.user);
          dispatch('getUserProfile');
        })
        .catch(error => {
          commit('AUTH_ERROR', error);
        });
    },
    register({ dispatch, commit }, params) {
      fb.auth
        .createUserWithEmailAndPassword(params.email, params.password)
        .then(response => {
          // Create user instance
          dispatch('newUser', response.user.uid, params);
          commit('AUTH_SUCCESS', response.user);
        })
        .catch(error => {
          commit('AUTH_ERROR', error);
        });
    },
    resetPassword({ commit }, { email }) {
      fb.auth.sendPasswordResetEmail(email).catch(error => {
        commit('SET_ERROR', error);
      });
    },
    getUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit('SET_USER_PROFILE', res.data());
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    getPartners({ commit, state }) {
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

          commit('SET_PARTNERS', partnersArray);
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    getPartner({ commit }, { id }) {
      const partner = this.partners[id];

      // Convert partner instance UNIX timestamp to Date
      const partnerDate = moment.unix(partner.approxDateMet.seconds);
      partner.approxDateMet = moment(partnerDate).toDate();

      commit('SET_PARTNER', partner);
    },
    getSex({ commit }) {
      fb.sexCollection
        .doc(this.currentUser.uid)
        .get()
        .then(querySnapshot => {
          const sexArray = [];
          let index = 0;

          querySnapshot.forEach(doc => {
            const sex = doc.data();
            sex.id = index;
            sexArray.push(sex);
            index += 1;
          });

          commit('SET_SEX', sexArray);
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    getPartnerId({ commit }, { id }) {
      const created = this.partners[id].createdOn;

      fb.partnersCollection
        .where('createdOn', '==', created)
        .get()
        .then(docs => {
          docs.forEach(doc => {
            commit('SET_PARTNER_ID', doc.id);
          });
        });
    },
    newUser({ dispatch, commit }, uid, params) {
      fb.usersCollection
        .doc(uid)
        .set({
          firstName: params.firstName,
          lastName: params.lastName,
        })
        .then(() => {
          dispatch('getUserProfile');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    newPartner({ dispatch, commit }, params) {
      fb.partnersCollection
        .add({
          createdOn: new Date(),
          userId: this.currentUser.uid,
          name: params.name,
          gender: params.gender,
          location: params.location,
          approxDateMet: params.approxDateMet,
          description: params.description,
        })
        .then(() => {
          dispatch('getPartners');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    newSex({ dispatch, commit }, id, params) {
      // !TO-DO: Test within calendar if partner id can be added to params
      dispatch('getPartnerId', id);

      fb.sexCollection
        .add({
          createdOn: new Date(),
          userId: this.currentUser.uid,
          partnerId: this.partnerId,
          rating: params.rating,
          type: params.type,
          date: params.date,
          protection: params.protection,
        })
        .then(() => {
          dispatch('getSex');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    newFeedback(params) {
      fb.feedbackCollection
        .add({
          createdOn: new Date(),
          userId: this.currentUser.uid,
          subject: params.subject,
          message: params.message,
        })
        .catch(error => {
          this.commit('SET_ERROR', error);
        });
    },
    updatePartner({ dispatch, commit }, params) {
      fb.partnersCollection
        .doc(this.partnerId)
        .update({
          updatedOn: new Date(),
          name: params.name,
          gender: params.gender,
          location: params.location,
          approxDateMet: params.approxDateMet,
          description: params.description,
        })
        .then(() => {
          dispatch('getPartners');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    deletePartner({ commit }, { id }) {
      fb.partnersCollection
        .doc(this.partnerId)
        .delete()
        .then(() => {
          commit('DELETE_PARTNER', id);
          commit('SET_PARTNER', {});
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    logout({ commit }) {
      fb.auth
        .signOut()
        .then(() => {
          commit('LOGOUT');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
  },
  getters: {
    isLoggedIn: state => !!state.currentUser,
    authStatus: state => state.authStatus,
  },
});

export default store;

// Handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('SET_CURRENT_USER', user);
    store.dispatch('getUserProfile');
    store.dispatch('getPartners');

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('SET_USER_PROFILE', doc.data());
    });

    // !TO-DO: Need to add separate array to handle collection updates
  }
});
