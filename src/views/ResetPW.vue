<template>
  <section class="forgot-password section-spacing">
    <div class="container container-half">
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
              <p class="control footer-buttons-flex">
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
      errorMsg: '',
    };
  },
  methods: {
    resetPassword() {
      this.performingRequest = true;

      this.$store.dispatch('resetPassword', {
        email: this.resetForm.email,
      })
      .then(() => {
        this.performingRequest = false;
        this.$buefy.snackbar.open({
          message: 'Email sent',
          type: 'is-success',
          position: 'is-top',
          actionText: null,
          indefinite: false,
        });
        this.$router.push('/');
      })
      .catch(error => console.error(error));
    },
  },
};
</script>
<style scoped>
.forgot-password {
  margin: 1rem;
  padding: 1rem;
}
.reset-button {
  display: flex;
  justify-content: center;
}
</style>