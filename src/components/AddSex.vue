<template>
  <b-modal :active.sync="$parent.isModalActive" has-modal-card>
    <div class="modal-card container">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Sex</p>
      </header>
      <section class="modal-card-body">
        <b-field>
          <b-select placeholder="Partner" icon="user" icon-pack="fas" v-model="sex.partner">
            <template v-for="partner in partners">
              <option :key="partner.id" :value="partner.id">{{ partner.name }}</option>
            </template>
          </b-select>
        </b-field>

        <b-field label="Rating">
          <b-slider :min="1" :max="5" ticks v-model.number="sex.rating"></b-slider>
        </b-field>

        <b-field label="Activities">
          <b-select multiple native-size="3" v-model="sex.type">
            <option value="Anal">Anal</option>
            <option value="Foreplay">Foreplay</option>
            <option value="Oral">Oral</option>
            <option value="Vaginal">Vaginal</option>
          </b-select>
        </b-field>

        <b-field label="Protection">
          <b-radio-button v-model="sex.protection" native-value="false" type="is-danger">
            <b-icon icon="close"></b-icon>
            <span>Nope</span>
          </b-radio-button>

          <b-radio-button v-model="sex.protection" native-value="true" type="is-success">
            <b-icon icon="check"></b-icon>
            <span>Yup</span>
          </b-radio-button>
        </b-field>
      </section>
      <footer class="modal-card-foot footer-buttons">
        <button class="button" type="button" v-on:click="close()">Close</button>
        <template>
          <button class="button is-primary" @click="createSex()">Add</button>
        </template>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';

export default {
	data() {
		return {
			sex: {
				partner: '',
				rating: null,
				type: [],
				protection: '',
			},
			default: {
				partner: '',
				rating: Number,
				type: [],
				protection: '',
			},
		};
	},
	props: ['calendarDate'],
	computed: {
		...mapState(['currentUser', 'partners']),
	},
	methods: {
		...mapActions(['newSex']),
		createSex() {
			const params = this.sex;
			params.date = this.calendarDate;
			console.log(params);

			this.newSex(params)
				.then(() => {
					this.$parent.close();
					this.partner = Object.assign({}, this.default);
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