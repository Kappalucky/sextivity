<template>
  <b-modal :active.sync="$parent.isModalActive" has-modal-card :on-cancel="close">
    <div class="modal-card container">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Partner</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Name/Nickname">
          <b-input type="text" v-model.trim="partner.name" placeholder="Guy from Tinder" required></b-input>
        </b-field>

        <b-field label="Gender">
          <b-select class="select-center" placeholder="Gender" v-model="partner.gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
          </b-select>
        </b-field>

        <b-field label="Description">
          <b-input
            placeholder="Brown eyes, plump sexy lips, freckles..."
            maxlength="200"
            type="textarea"
            v-model="partner.description"
          ></b-input>
        </b-field>

        <b-field label="Location Met">
          <b-input
            type="text"
            v-model.trim="partner.location"
            placeholder="London, England"
            required
          ></b-input>
        </b-field>

        <b-field label="Approximate Meeting Date">
          <b-datepicker
            type="month"
            placeholder="Click to select..."
            v-model="partner.approxDateMet"
            icon="calendar-today"
          ></b-datepicker>
        </b-field>
      </section>
      <footer class="modal-card-foot footer-buttons">
        <button class="button" type="button" v-on:click="close()">Close</button>
        <template>
          <button class="button is-primary" @click="createPartner()">Add</button>
        </template>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
	data() {
		return {
			partner: {
				name: '',
				gender: '',
				location: '',
				approxDateMet: new Date(),
				description: '',
			},
			default: {
				name: '',
				gender: '',
				location: '',
				approxDateMet: new Date(),
				description: '',
			},
		};
	},
	computed: {
		...mapState(['currentUser']),
	},
	methods: {
		...mapActions(['newPartner']),
		createPartner() {
			this.newPartner(this.partner)
				.then(() => {
					this.partner = Object.assign({}, this.default);
					this.$parent.close();
				})
				.catch(error => console.error(error));
		},
		close() {
			this.partner = Object.assign({}, this.default);
			this.$parent.close();
		},
	},
};
</script>
<style scoped>
</style>