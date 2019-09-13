<template>
  <div id="app">
    <App-navbar />
    <main>
      <router-view />
    </main>
    <!--<App-footer />-->
  </div>
</template>
<script>
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
	name: 'Sextivity',
	components: {
		AppNavbar,
		AppFooter,
	},
};
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Damion|Molle:400i&display=swap');

#app {
	font-family: 'Damion', cursive, 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
}
#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
.footer-buttons {
	justify-content: center;
}
.footer-buttons-flex {
	display: flex;
	justify-content: center;
}
.select-center {
	display: flex;
	justify-content: center;
}
.container-half {
	width: 50%;
}
.card-header-title {
	justify-content: center;
}
.section-spacing {
	margin: 1rem;
	padding: 1rem;
}
.red {
	color: red;
}
</style>
