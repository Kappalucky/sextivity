<template>
    <b-modal :active.sync="$parent.isModalActive" has-modal-card>
            <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Login</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Email">
          <b-input type="email" v-model="email" placeholder="Your email" required></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Your password"
            required
          ></b-input>
        </b-field>

        <b-checkbox>Remember me</b-checkbox>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" v-on:click="$parent.close()">Close</button>
        <button class="button is-primary">Add</button>
      </footer>
    </div>
  </form>
        </b-modal>
</template>
<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {

  }
};
</script>
<style scoped>
</style>