<template>
  <section class="join">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Join</p>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="text" placeholder="First Name" />
              <span class="icon is-small is-left">
                <i class="fas fa-pen"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="text" placeholder="Last Name" />
              <span class="icon is-small is-left">
                <i class="fas fa-pen"></i>
              </span>
            </p>
          </div>
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
            <p class="control has-icons-left">
              <input class="input" type="password" placeholder="Confirm Password" />
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control join-button">
              <button class="button is-success">Join</button>
            </p>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item">Have An Account? Login!</a>
      </footer>
    </div>
  </section>
</template>
<script>
//const fb = require('../firebaseConfig.js');

export default {
  name: 'Join',
  data() {
    return {
      signupForm: {
        firstName: '',
        lastName: '',
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
</style>
