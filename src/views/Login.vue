<template>
  <section class="login section-spacing">
    <div class="container container-half">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Login</p>
        </header>
        <div class="card-content">
          <div class="content">
            <form @submit.prevent="validateBeforeSubmit" v-on:keyup.enter="validateBeforeSubmit">
              <p v-if="authError">{{ authError }}</p>
              <b-field label="Email">
                <b-input
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  v-model="loginForm.email"
                />
              </b-field>
              <b-field label="Password">
                <b-input
                  name="password"
                  type="password"
                  placeholder="********"
                  v-model="loginForm.password"
                />
              </b-field>
              <div class="field">
                <div class="control footer-buttons-flex">
                  <button type="submit" class="button is-primary">Login</button>
                </div>
              </div>
            </form>
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
				email: null,
				password: null,
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
		validateBeforeSubmit() {
			//this.$validator.validateAll().then(result => {
			//if (result) {

			this.login();
			//}
			//	});
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
				});
		},
	},
};
</script>

<style scoped>
</style>
