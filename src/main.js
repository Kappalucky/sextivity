import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import router from './router';
import store from './store';

const firebase = require('./firebaseConfig.js');

Vue.use(Buefy);

Vue.config.productionTip = false;

// Handle page reloads
let app;
firebase.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
