<template>
  <section class="join section-spacing">
    <div class="container container-half">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Join</p>
        </header>
        <div class="card-content">
          <div class="content">
            <form @submit.prevent="validateBeforeSubmit" v-on:keyup.enter="validateBeforeSubmit">
              <b-field label="First name">
                <b-input
                  id="first-name"
                  name="firstName"
                  type="text"
                  placeholder="Vincent"
                  v-model="signupForm.firstName"
                />
              </b-field>
              <b-field label="Last name">
                <b-input
                  id="last-name"
                  name="lastName"
                  type="text"
                  placeholder="Mayers"
                  v-model="signupForm.lastName"
                />
              </b-field>
              <b-field label="Email">
                <b-input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  v-model="signupForm.email"
                />
              </b-field>
              <b-field label="Password">
                <b-input
                  name="password"
                  type="password"
                  placeholder="********"
                  v-model="signupForm.password"
                />
              </b-field>
              <b-field label="Confirm password">
                <b-input
                  name="confirm-password"
                  type="password"
                  placeholder="********"
                  v-model="signupForm.confirmPassword"
                />
              </b-field>
              <div class="field">
                <div class="control footer-buttons-flex">
                  <button type="submit" class="button is-primary">Join</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <footer class="card-footer">
          <a href="/login" class="card-footer-item">Have An Account? Login!</a>
        </footer>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex';

export default {
	name: 'Join',
	data() {
		return {
			signupForm: {
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				confirmPassword: '',
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
		passwordMatch(password, confirmation) {
			return password === confirmation ? true : false;
		},
		validateBeforeSubmit() {
			if (
				this.passwordMatch(
					this.signupForm.password,
					this.signupForm.confirmPassword,
				) === true
			) {
				this.signup();
			} else {
				return;
			}
		},
		signup() {
			this.performingRequest = true;
			this.$store
				.dispatch('register', this.signupForm)
				.then(() => {
					this.performingRequest = false;
					//this.$router.push('/dashboard');
				})
				.catch(error => console.error(error));
		},
	},
};
</script>

<style scoped>
</style>
