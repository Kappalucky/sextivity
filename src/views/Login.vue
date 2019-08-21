<template>
  <section class="login">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Login</p>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input class="input" type="email" placeholder="Email" />
              <span class="icon is-small is-left">
                <b-icon pack="fas" icon="envelope"></b-icon>
                <i class="fas fa-envelope"></i>
              </span>
              <span class="icon is-small is-right">
                <i class="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="password" placeholder="Password" />
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control login-button">
              <button class="button is-success">Login</button>
            </p>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a href="/reset-password" class="card-footer-item">Forgot Password?</a>
        <a href="#" class="card-footer-item">No Account? Join!</a>
      </footer>
    </div>
  </section>
</template>
<script>
//const fb = require('../firebaseConfig.js');

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
  methods: {
    toggleForm() {
      this.errorMsg = '';
    },
    login() {
      this.performingRequest = true;

      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password,
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user.user);
          this.$store.dispatch('fetchUserProfile');
          this.performingRequest = false;
          this.$router.push('/dashboard');
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
  },
};
</script>

<style scoped>
.login {
  margin: 1rem;
  padding: 1rem;
}
.card-header-title {
  justify-content: center;
}
.login-button {
  display: flex;
  justify-content: center;
}
</style>
