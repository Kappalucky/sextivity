<template>
  <section class="navigation">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item href="/">
          <p>Sextivity</p>
        </b-navbar-item>
      </template>
      <template v-if="currentUser" slot="start">
        <b-navbar-item href="/dashboard">Overview</b-navbar-item>
        <b-navbar-item href="/feedback">Feedback</b-navbar-item>
      </template>
      <!--<template v-else slot="start">
        <b-navbar-item href="/dashboard">Overview</b-navbar-item>
        <b-navbar-item href="/features">Feedback</b-navbar-item>
      </template>-->
      <template v-if="currentUser" slot="end">
        <b-navbar-item tag="div" class="navbar-dropdown-end">
          <div class="buttons">
            <a class="button is-danger" @click="logout">
              <strong>logout</strong>
            </a>
          </div>
        </b-navbar-item>
      </template>
      <template v-else slot="end">
        <b-navbar-item tag="div" class="navbar-dropdown-end">
          <div class="buttons">
            <a class="button is-primary" href="/join">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light" href="/login">Log in</a>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </section>
</template>

<script>
const fb = require('../firebaseConfig.js');

export default {
  name: 'Navbar',
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
  },
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch('clearData');
          this.$router.push('/login');
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.navigation {
  /*border-bottom: 1px solid #e2e2e2;*/
  margin-bottom: 1rem;
  box-shadow: -1px -7px 9px 5px black;
}
.navbar-dropdown-end {
  display: flex;
  justify-content: center;
}
</style>
