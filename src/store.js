/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import router from '@/router';

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
    SET_AVERAGES({ state, dispatch }) {
      if (state.sex.length !== 0) {
        state.partners.forEach(obj => {
          dispatch('getAverage', obj.partnerId);
        });
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
    DELETE_SEX(state, sexId) {
      const newObject = state.sex.filter(
        sexInstance => sexInstance.id !== sexId,
      );
      state.sex = newObject;
    },
    LOGOUT() {
      store.state.error = '';
      store.state.authStatus = '';
      store.state.authError = '';
      store.state.currentUser = null;
      store.state.userProfile = {};
      store.state.partners = [];
      store.state.sex = [];
      store.state.events = [];
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
          dispatch('getSex');
          dispatch('getPartners');
          router.push('/dashboard');
        })
        .catch(error => {
          commit('AUTH_ERROR', error);
        });
    },
    register({ dispatch, commit }, params) {
      fb.auth
        .createUserWithEmailAndPassword(params.email, params.password)
        .then(() => {
          dispatch('loginWithEmail', {
            email: params.email,
            password: params.password,
          });
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
          commit('SET_SEX', sexArray);
          commit('SET_EVENTS', sexArray);
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    getIndividualSex({ state, commit }, id) {
      const sex = state.sex[id];
      // Changes Sex object date attribute from UTC to "Jan. 12th 2019" format
      const sexDate = moment(sex.date).toDate();
      sex.date = sexDate;

      commit('SET_INDIVIDUAL_SEX', sex);
    },
    getAverage({ state, dispatch }, uid) {
      // Does not get updated state sex array before filter
      // have to add object in sex array more than once to get refresh
      const partner = state.sex.filter(sex => sex.partnerId === uid);
      if (partner.length === 0) {
        // console.log('partner at 0:', partner);
        dispatch('getAverage');
      } else {
        // console.log('partners:', partner);
        const average =
          partner.reduce((acc, sex) => acc + sex.rating, 0) / partner.length;
        // console.log('average', average);
        const data = {
          uid,
          average,
        };
        dispatch('updateRating', data);
      }
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
    newFeedback({ state, commit }, params) {
      fb.feedbackCollection
        .add({
          createdOn: new Date().toISOString(),
          userId: state.currentUser.uid,
          subject: params.subject,
          message: params.message,
        })
        .catch(error => {
          commit('SET_ERROR', error);
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
    updateRating({ commit, dispatch }, params) {
      fb.partnersCollection
        .doc(params.uid)
        .update({
          updatedOn: new Date().toISOString(),
          rating: params.average,
        })
        .then(() => {
          dispatch('getPartners');
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    deletePartner({ state, commit, dispatch }, id) {
      fb.partnersCollection
        .doc(state.partners[id].uid)
        .delete()
        .then(() => {
          dispatch('getPartners');
          commit('SET_PARTNER', {});
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    deleteSex({ state, commit, dispatch }, id) {
      fb.sexCollection
        .doc(state.sex[id].uid)
        .delete()
        .then(() => {
          dispatch('getSex');
          commit('SET_INDIVIDUAL_SEX', {});
        })
        .catch(error => {
          commit('SET_ERROR', error);
        });
    },
    logout({ commit }) {
      fb.auth.signOut().then(() => {
        commit('LOGOUT');
        router.push('/login');
      });
    },
  },
  getters: {
    isLoggedIn: state => state.currentUser != null,
    authStatus: state => state.authStatus,
  },
});

export default store;

// Handle page reload
// Need to find more efficient way to check auth status without constantly making calls to firebase
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('SET_CURRENT_USER', user);
    store.dispatch('getUserProfile');
    store.dispatch('getSex');
    store.dispatch('getPartners');
    /* fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('SET_USER_PROFILE', doc.data());
    }); */
    // !TO-DO: Need to add separate array to handle collection updates
  } else {
    store.commit('SET_CURRENT_USER', null);
    // store.dispatch('logout');
  }
});
