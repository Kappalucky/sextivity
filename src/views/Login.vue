<template>
  <section class="login section-spacing">
    <div class="container container-half">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Login</p>
        </header>
        <div class="card-content">
          <div class="content">
            <div class="field">
              <p class="control">
                <label for="email">Email</label>
                <input
                  class="input"
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  v-model.trim="loginForm.email"
                />
              </p>
            </div>
            <div class="field">
              <p class="control">
                <label for="password">Password</label>
                <input
                  class="input"
                  id="password"
                  type="password"
                  placeholder="********"
                  v-model.trim="loginForm.password"
                />
              </p>
            </div>
            <div class="field">
              <p class="control footer-buttons-flex">
                <button class="button is-success" @click="login()">Login</button>
              </p>
            </div>
          </div>
        </div>
        <footer class="card-footer">
          <a href="/reset-password" class="card-footer-item">Forgot Password?</a>
          <a href="/join" class="card-footer-item">No Account? Join!</a>
        </footer>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex';

export default {
	name: 'Login',
	data() {
		return {
			loginForm: {
				email: '',
				password: '',
			},
			performingRequest: false,
			errorMsg: '',
		};
	},
	computed: {
		...mapState(['authError', 'authStatus']),
	},
	methods: {
		toggleForm() {
			this.errorMsg = '';
		},
		login() {
			this.performingRequest = true;

			this.$store
				.dispatch('loginWithEmail', {
					email: this.loginForm.email,
					password: this.loginForm.password,
				})
				.then(() => {
					this.performingRequest = false;
					//this.$router.push('/dashboard').catch(err => console.log(err));
				})
				.catch(error => console.error(error));
		},
	},
};
</script>

<style scoped>
</style>
