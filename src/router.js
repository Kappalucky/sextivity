import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import Feedback from './views/Feedback.vue';
import Login from './views/Login.vue';
import Join from './views/Join.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/join',
      name: 'join',
      component: Join,
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback,
    },
  ],
});
