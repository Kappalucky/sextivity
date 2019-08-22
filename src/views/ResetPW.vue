<template>
  <section class="forgot-password">
    <div class="container">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Forgot Password</p>
        </header>
        <div class="card-content">
          <div class="content">
            <div class="field">
              <input class="input" type="text" placeholder="Email" />
            </div>
            <div class="field">
              <p class="control reset-button">
                <button class="button is-success">Reset</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'ResetPW',
  data() {
    return {
      resetForm: {
        email: '',
      },
      performingRequest: false,
      passwordResetSuccess: false,
      errorMsg: '',
    };
  },
  methods: {
    resetPassword() {
      this.performingRequest = true;

      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false;
          this.passwordResetSuccess = true;
          this.passwordForm.email = '';
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
.forgot-password {
  margin: 1rem;
  padding: 1rem;
}
.card-header-title {
  justify-content: center;
}
.reset-button {
  display: flex;
  justify-content: center;
}
.container {
  width: 50%;
}
</style>