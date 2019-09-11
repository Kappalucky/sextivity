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
    individualSex: {}, // Single Sex instance details
    realTimePartners: [], // Array to handle incoming updates to Partner Collection
    sex: [], // Array of Days User had sex
    events: [],
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
    SET_SEX(state, payload) {
      if (payload) {
        state.sex = payload;
      } else {
        state.sex = [];
      }
    },
    SET_EVENTS(state, payload) {
      const events = [];

      payload.forEach(obj => {
        Object.entries(obj).forEach(entry => {
          const key = entry[0];
          const value = entry[1];

          if (key === 'date') {
            events.push({
              title: 'Sex',
              sexUid: obj.uid,
              sexId: obj.id,
              start: moment(value).format('MM-DD-YYYY'),
              end: null,
            });
          }
        });
      });
      state.events = events;
    },
    SET_INDIVIDUAL_SEX(state, payload) {
      state.individualSex = payload;
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
    DELETE_SEX(state, sexId) {
      const newObject = state.sex.filter(
        sexInstance => sexInstance.id !== sexId,
      );
      state.sex = newObject;
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
    getUserProfile({ state, commit }) {
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
    getPartners({ state, commit }) {
      fb.partnersCollection
        .where('userId', '==', state.currentUser.uid)
        .get()
        .then(queryDocumentSnapshot => {
          const partnersArray = [];
          let index = 0;

          queryDocumentSnapshot.forEach(doc => {
            const partner = doc.data();
            partner.uid = doc.id;
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
    getPartner({ state, commit }, id) {
      const partner = state.partners[id];

      const partnerDate = moment(partner.approxDateMet).toDate();
      partner.approxDateMet = partnerDate;

      commit('SET_PARTNER', partner);
    },
    getSex({ state, commit }) {
      fb.sexCollection
        .where('userId', '==', state.currentUser.uid)
        .get()
        .then(queryDocumentSnapshot => {
          const sexArray = [];
          let index = 0;

          queryDocumentSnapshot.forEach(doc => {
            const sex = doc.data();
            sex.uid = doc.id;
            sex.id = index;
            sexArray.push(sex);
            index += 1;
          });
          commit('SET_EVENTS', sexArray);
          commit('SET_SEX', sexArray);
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    getIndividualSex({ state, commit }, id) {
      const sex = state.sex[id];

      const sexDate = moment(sex.date).toDate();
      sex.date = sexDate;

      const partnerObj = state.partners
        .filter(partner => partner.uid === sex.partnerId)
        .find(e => e.id);

      sex.partner = partnerObj;

      commit('SET_INDIVIDUAL_SEX', sex);
    },
    getAverage({ state, dispatch }, uid) {
      const partner = state.sex.filter(sex => sex.partnerId === uid);
      const average =
        partner.reduce((acc, sex) => acc + sex.rating, 0) / partner.length;
      dispatch('updateRating', uid, average);
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
    newPartner({ state, dispatch, commit }, params) {
      fb.partnersCollection
        .add({
          createdOn: new Date().toISOString(),
          userId: state.currentUser.uid,
          name: params.name,
          gender: params.gender,
          location: params.location,
          approxDateMet: params.approxDateMet.toISOString(),
          description: params.description,
        })
        .then(() => {
          dispatch('getPartners');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    newSex({ state, dispatch, commit }, params) {
      fb.sexCollection
        .add({
          createdOn: new Date().toISOString(),
          userId: state.currentUser.uid,
          partnerId: state.partners[params.partner].uid,
          rating: params.rating,
          type: params.type,
          date: params.date.toISOString(),
          protection: params.protection,
        })
        .then(() => {
          dispatch('getSex');
          dispatch('getAverage', state.partners[params.partner].uid);
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    newFeedback({ state }, params) {
      fb.feedbackCollection
        .add({
          createdOn: new Date().toISOString(),
          userId: state.currentUser.uid,
          subject: params.subject,
          message: params.message,
        })
        .catch(error => {
          this.commit('SET_ERROR', error);
        });
    },
    updatePartner({ state, dispatch, commit }, params) {
      fb.partnersCollection
        .doc(state.partners[params.id].uid)
        .update({
          updatedOn: new Date().toISOString(),
          name: params.name,
          gender: params.gender,
          location: params.location,
          approxDateMet: params.approxDateMet.toISOString(),
          description: params.description,
        })
        .then(() => {
          commit('SET_PARTNER', {});
          dispatch('getPartners');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    updateIndividualSex({ dispatch, commit }, params) {
      fb.sexCollection
        .doc(params.uid)
        .update({
          updatedOn: new Date().toISOString(),
          rating: params.rating,
          type: params.type,
          protection: params.protection,
        })
        .then(() => {
          commit('SET_INDIVIDUAL_SEX', {});
          dispatch('getSex');
          dispatch('getAverage', params.partnerId);
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    updateRating({ dispatch }, uid, rating) {
      fb.partnersCollection
        .doc(uid)
        .update({
          updatedOn: new Date().toISOString(),
          rating,
        })
        .then(() => {
          dispatch('getPartners');
        })
        .catch(error => {
          this.commit('SET_ERROR', error);
        });
    },
    deletePartner({ state, commit }, id) {
      fb.partnersCollection
        .doc(state.partners[id].uid)
        .delete()
        .then(() => {
          commit('DELETE_PARTNER', id);
          commit('SET_PARTNER', {});
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    deleteSex({ state, commit }, id) {
      fb.sexCollection
        .doc(state.sex[id].uid)
        .delete()
        .then(() => {
          commit('DELETE_SEX', id);
          commit('SET_INDIVIDUAL_SEX', {});
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
    store.dispatch('getSex');

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('SET_USER_PROFILE', doc.data());
    });

    // !TO-DO: Need to add separate array to handle collection updates
  }
});
