<template>
  <section class="feedback">
    <div class="container">
      <section class="feedback-form">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Feedback</p>
          </header>
          <div class="card-content">
            <div class="content">
              <b-field label="Subject">
                <b-input type="text" v-model.trim="feedback.subject" placeholder="Home page improvements" required></b-input>
              </b-field>
              <b-field label="Message">
                <b-input type="textarea" maxlength="500" v-model="feedback.message" placeholder="The top of the page looks weird on my Iphone X..." required></b-input>
              </b-field>
            </div>
          </div>
          <footer class="card-footer footer-buttons">
            <button class="button is-primary" type="button" @click="sendFeedback()">Send</button>
          </footer>
        </div>
      </section>
    </div>
  </section>
</template>
<script>
export default {
  name: 'Feedback',
  data() {
    return {
      feedback: {
        subject: '',
        message: '',
      },
    };
  },
  methods: {
    sendFeedback() {
      this.$store.dispatch('newFeedback', this.feedback)
      .then(() => {
        this.$buefy.snackbar.open({
          message: 'Feedback sent',
          type: 'is-success',
          position: 'is-top',
          actionText: null,
          indefinite: false,
        })
        this.feedback = {};
      })
      .catch(error => console.error(error));
    },
  },
};
</script>

<style scoped>
.feedback {
  margin: 1rem;
  padding: 1rem;
}
.card-header-title {
  justify-content: center;
}
.footer-buttons {
  justify-content: center;
}
.container {
  width: 50%;
}
</style>