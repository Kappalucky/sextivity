<template>
  <b-modal :active.sync="$parent.editSexModal" has-modal-card :on-cancel="close">
    <div class="modal-card container">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Sex</p>
      </header>
      <section class="modal-card-body">
        <template v-if="!this.sex.partner && this.sex.partner !== 0">
          <small style="color:red;">Partner Deleted</small>
          <b-field label="Partner">
            <b-select
              class="select-center"
              placeholder="Partner"
              icon="user"
              icon-pack="fas"
              disabled
            ></b-select>
          </b-field>
        </template>
        <template v-else>
          <b-field label="Partner">
            <b-select
              class="select-center"
              placeholder="Partner"
              icon="user"
              icon-pack="fas"
              v-model="sex.partner"
            >
              <template v-for="partner in partners">
                <option :key="partner.id" :value="partner.id">{{ partner.name }}</option>
              </template>
            </b-select>
          </b-field>
        </template>

        <b-field label="Rating">
          <b-slider :min="1" :max="5" ticks v-model.number="sex.rating"></b-slider>
        </b-field>

        <b-field label="Activities">
          <b-select class="select-center" multiple native-size="3" v-model="sex.type">
            <option value="Anal">Anal</option>
            <option value="Foreplay">Foreplay</option>
            <option value="Oral">Oral</option>
            <option value="Vaginal">Vaginal</option>
          </b-select>
        </b-field>

        <b-field class="protection" label="Protection">
          <div class="protection-buttons">
            <b-radio-button v-model="sex.protection" native-value="false" type="is-danger">
              <b-icon icon="close"></b-icon>
              <span>Nope</span>
            </b-radio-button>

            <b-radio-button v-model="sex.protection" native-value="true" type="is-success">
              <b-icon icon="check"></b-icon>
              <span>Yup</span>
            </b-radio-button>
          </div>
        </b-field>
      </section>
      <footer class="modal-card-foot footer-buttons">
        <button class="button" type="button" v-on:click="close()">Close</button>
        <template>
          <button class="button is-primary" @click="editSex()">Update</button>
          <button class="button is-danger" @click="removeSex()">Delete</button>
        </template>
      </footer>
    </div>
  </b-modal>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
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
				rating: null,
				type: [],
				protection: '',
			},
		};
	},
	computed: {
		...mapState(['individualSex', 'partners']),
	},
	watch: {
		individualSex(newValue, oldValue) {
			this.sex = Object.assign({}, newValue);
		},
		sex(newValue, oldValue) {
			const partnerId = this.partners.filter(
				partner => partner.uid === this.sex.partnerId,
			);
			if (partnerId.length !== 0) {
				const sexId = partnerId;
				this.sex.partner = partnerId[0].id;
			}
		},
	},
	methods: {
		...mapActions(['updateIndividualSex', 'deleteSex']),
		...mapMutations(['SET_INDIVIDUAL_SEX']),
		editSex() {
			this.updateIndividualSex(this.sex)
				.then(() => {
					this.close();
				})
				.catch(error => console.error(error));
		},
		removeSex() {
			this.deleteSex(this.sex.id)
				.then(() => {
					this.$parent.closeEdit();
					this.$buefy.snackbar.open({
						message: 'Event deleted',
						type: 'is-success',
						position: 'is-top',
						actionText: null,
						indefinite: false,
					});
				})
				.catch(error => console.error(error));
		},
		close() {
			this.SET_INDIVIDUAL_SEX({});
			this.$parent.closeEdit();
		},
	},
};
</script>
<style scoped>
.protection {
	justify-content: center;
}
.protection-buttons {
	display: flex;
	justify-content: center;
}
</style>