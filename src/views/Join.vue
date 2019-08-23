<template>
  <section class="join">
    <div class="container">
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
            <!--<div class="field">
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
            </div>-->
            <div class="field">
              <p class="control join-button">
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
const fb = require('../firebaseConfig.js');

export default {
  name: 'Join',
  data() {
    return {
      signupForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        //confirmedPassword: '',
      },
      performingRequest: false,
      errorMsg: '',
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = '';
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
              firstName: this.signupForm.firstName,
              lastName: this.signupForm.lastName,
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
.join {
  margin: 1rem;
  padding: 1rem;
}
.card-header-title {
  justify-content: center;
}
.join-button {
  display: flex;
  justify-content: center;
}
.container {
  width: 50%;
}
</style>
