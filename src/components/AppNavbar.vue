<template>
  <section class="navigation">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <p class="navbar-title">Sextivity</p>

        <a
          role="button"
          :class="{ 'is-active': isActive }"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          v-on:click="isActive = !isActive"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isActive }">
        <template v-if="isLoggedIn">
          <div class="navbar-start">
            <a class="navbar-item" href="/dashboard">Overview</a>
            <a class="navbar-item" href="/feedback">Feedback</a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item navbar-dropdown-end">
              <div class="buttons">
                <a class="button is-danger" @click="logout">
                  <strong>logout</strong>
                </a>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="navbar-end">
            <div class="navbar-item navbar-dropdown-end">
              <div class="buttons">
                <a class="button is-primary" href="/join">
                  <strong>Sign up</strong>
                </a>
                <a class="button is-light" href="/login">Log in</a>
              </div>
            </div>
          </div>
        </template>
      </div>
    </nav>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'Navbar',
	data() {
		return {
			isActive: false,
		};
	},
	computed: {
		...mapGetters(['isLoggedIn']),
	},
	methods: {
		/*logout() {
			this.$store.dispatch('logout').then(() => {
				this.$router.push('/login');
      });*/
		...mapActions(['logout']),
	},
};
</script>

<style scoped>
.navigation {
	/*border-bottom: 1px solid #e2e2e2;*/
	margin-bottom: 1rem;
	box-shadow: -1px -7px 9px 5px black;
}
.navbar-brand {
	align-items: center;
}
.navbar-dropdown-end {
	display: flex;
	justify-content: center;
}
.navbar-title {
	font-family: 'Molle', cursive;
	color: #88c4da;
	padding-left: 1rem;
}
</style>
