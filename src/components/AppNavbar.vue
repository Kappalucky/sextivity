<template>
  <section class="navigation">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item>
          <p class="navbar-title">Sextivity</p>
        </b-navbar-item>
      </template>
      <template v-if="isLoggedIn">
        <template slot="start">
          <b-navbar-item href="/dashboard">Overview</b-navbar-item>
          <b-navbar-item href="/feedback">Feedback</b-navbar-item>
        </template>
        <template slot="end">
          <b-navbar-item tag="div" class="navbar-dropdown-end">
            <div class="buttons">
              <a class="button is-danger" @click="logout">
                <strong>logout</strong>
              </a>
            </div>
          </b-navbar-item>
        </template>
      </template>
      <template v-else>
        <template slot="end">
          <b-navbar-item tag="div" class="navbar-dropdown-end">
            <div class="buttons">
              <a class="button is-primary" href="/join">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light" href="/login">Log in</a>
            </div>
          </b-navbar-item>
        </template>
      </template>
    </b-navbar>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'Navbar',
	computed: {
		...mapGetters(['isLoggedIn']),
	},
	methods: {
		logout() {
			this.$store.dispatch('logout').then(() => {
				this.$router.push('/login');
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
.navbar-title {
	font-family: 'Molle', cursive;
	color: #88c4da;
}
</style>
