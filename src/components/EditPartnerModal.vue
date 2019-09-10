<template>
  <b-modal :active.sync="$parent.editPartnerModal" has-modal-card :on-cancel="close">
    <div class="modal-card container">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Partner</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Name/Nickname">
          <b-input
            type="text"
            v-model.trim="componentPartner.name"
            placeholder="Guy from Tinder"
            required
          ></b-input>
        </b-field>

        <b-field label="Gender">
          <b-select class="select-center" placeholder="Gender" v-model="componentPartner.gender">
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
            v-model="componentPartner.description"
          ></b-input>
        </b-field>

        <b-field label="Location Met">
          <b-input
            type="text"
            v-model.trim="componentPartner.location"
            placeholder="London, England"
            required
          ></b-input>
        </b-field>

        <b-field label="Approximate Meeting Date">
          <b-datepicker
            type="month"
            placeholder="Click to select..."
            v-model="componentPartner.approxDateMet"
            icon="calendar-today"
          ></b-datepicker>
        </b-field>
      </section>
      <footer class="modal-card-foot footer-buttons">
        <button class="button" type="button" v-on:click="$parent.closeEdit()">Close</button>
        <button class="button is-primary" @click="update()">Edit</button>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';

export default {
	data() {
		return {
			componentPartner: {
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
		...mapState(['partner']),
	},
	watch: {
		partner(newValue, oldValue) {
			this.componentPartner = Object.assign({}, this.partner);
		},
	},
	methods: {
		...mapActions(['updatePartner']),
		...mapMutations(['SET_PARTNER']),
		update() {
			this.updatePartner(this.partner)
				.then(() => this.$parent.closeEdit())
				.catch(error => console.error(error));
		},
		close() {
			this.SET_PARTNER({});
			this.$parent.closeEdit();
		},
	},
};
</script>
<style scoped>
</style>