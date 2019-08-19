<template>
  <section id="join">
    <h1>Join</h1>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Join</p>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input class="input" type="email" placeholder="Email" />
              <span class="icon is-small is-left">
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
            <p class="control">
              <button class="button is-success">Join</button>
            </p>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item">Have Account? Login!</a>
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
      signupForm: {
        name: '',
        title: '',
        email: '',
        password: '',
      },
      passwordForm: {
        email: '',
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: '',
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = '';
      this.showLoginForm = !this.showLoginForm;
    },
    signup() {
      this.performingRequest = true;

      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password,
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user.user);

          // Create user obj
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: this.signupForm.name,
              title: this.signupForm.title,
            })
            .then(() => {
              this.$store.dispatch('fetchUserProfile');
              this.performingRequest = false;
              this.$router.push('/dashboard');
            })
            .catch(err => {
              console.log(err);
              this.performingRequest = false;
              this.errorMsg = err.message;
            });
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
</style>
