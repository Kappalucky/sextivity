<template>
  <section>
    <b-navbar>
      <template slot="brand">
        <b-navbar-item href="/">
          <p>Sextivity</p>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item href="#">Overview</b-navbar-item>
        <b-navbar-item href="#">Feedback</b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light">Log in</a>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </section>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style scoped>
</style>
