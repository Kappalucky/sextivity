<template>
  <section>
    <b-navbar>
      <template slot="brand">
        <b-navbar-item href="/">
          <p>Sextivity</p>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item href="/dashboard">Overview</b-navbar-item>
        <b-navbar-item href="/feedback">Feedback</b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-primary" href="/join">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light" href="/login">Log in</a>
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
