<template>
  <section class="join section-spacing">
    <div class="container container-half">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Join</p>
        </header>
        <div class="card-content">
          <div class="content">
            <div class="field">
              <p class="control">
                <label for="first-name">First Name</label>
                <input
                  class="input"
                  id="first-name"
                  type="text"
                  placeholder="Vincent"
                  v-model.trim="signupForm.firstName"
                />
              </p>
            </div>
            <div class="field">
              <p class="control">
                <label for="last-name">Last Name</label>
                <input
                  class="input"
                  id="last-name"
                  type="text"
                  placeholder="Mayers"
                  v-model.trim="signupForm.lastName"
                />
              </p>
            </div>
            <div class="field">
              <p class="control">
                <label for="email">Email</label>
                <input
                  class="input"
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  v-model.trim="signupForm.email"
                />
              </p>
            </div>
            <div class="field">
              <p class="control">
                <label for="password1">Password</label>
                <input
                  class="input"
                  id="password1"
                  type="password"
                  placeholder="********"
                  v-model.trim="signupForm.password"
                />
              </p>
            </div>
            <div class="field">
              <p class="control">
                <label for="password2">Confirm Password</label>
                <input
                  class="input"
                  id="password2"
                  type="password"
                  placeholder="********"
                  v-model.trim="signupForm.confirmedPassword"
                />
              </p>
            </div>
            <div class="field">
              <p class="control footer-buttons-flex">
                <button class="button is-success" @click.enter="signup">Join</button>
              </p>
            </div>
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
        confirmedPassword: '',
      },
      performingRequest: false,
      errorMsg: '',
    };
  },
  computed: {
    ...mapState(['authError', 'authStatus'])
  },
  methods: {
    toggleForm() {
      this.errorMsg = '';
    },
    passwordMatch(password, confirmation) {
      return password === confirmation ? true : false;
    },
    signup() {
      this.performingRequest = true;

      if (passwordMatch(this.signupForm.password, this.signupForm.confirmedPassword) == true) {
        this.$store.dispatch('register', this.signupForm)
        .then(() => {
          this.performingRequest = false;
          this.$router.push('/dashboard');
        })
        .catch(error => console.error(error));
      } else {
        console.error('Password do not match');
      }
    },
  },
};
</script>

<style scoped>
</style>
