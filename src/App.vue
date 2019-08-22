<template>
  <div id="app">
    <App-navbar :currentUser = currentUser />
    <main>
      <router-view />
    </main>
    <App-footer />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'Sextivity',
  components: {
    AppNavbar,
    AppFooter,
  },
  computed: {
    ...mapState(['currentUser']),
  },
};
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
