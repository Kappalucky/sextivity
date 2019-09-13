import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';

import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import Feedback from './views/Feedback.vue';
import Login from './views/Login.vue';
import Join from './views/Join.vue';
import ResetPW from './views/ResetPW.vue';
import Error404 from './views/Error404.vue';
import Error500 from './views/Error500.vue';

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
      //name: 'Home',
      //component: Home,
      redirect: '/login',
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
    {
      path: '/404',
      name: 'Error404',
      component: Error404,
    },
    {
      path: '/500',
      name: 'Error500',
      component: Error500,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const { currentUser } = firebase.auth();

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresAuth && currentUser) {
    next();
  } else if (!requiresAuth && currentUser) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
