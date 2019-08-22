import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';

import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import Feedback from './views/Feedback.vue';
import Login from './views/Login.vue';
import Join from './views/Join.vue';
import ResetPW from './views/ResetPW.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/dashboard',
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/join',
      name: 'Join',
      component: Join,
    },
    {
      path: '/reset-password',
      name: 'ResetPW',
      component: ResetPW,
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
      meta: {
        requiresAuth: true,
      },
    },
    /* TO-DO: Add Error page routes 404, 500...etc
              Add Profile routes */
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const { currentUser } = firebase.auth();

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
