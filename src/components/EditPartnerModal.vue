<template>
    <b-modal :active.sync="$parent.editPartnerModal" has-modal-card>
    <div class="modal-card container">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Partner</p>
      </header>
      <section class="modal-card-body">

        <b-field label="Name/Nickname">
          <b-input type="text" v-model.trim="partner.name" placeholder="Guy from Tinder" required></b-input>
        </b-field>

        <b-field label="Gender">
            <b-select class="gender-select" placeholder="Gender" v-model="partner.gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
            </b-select>
        </b-field>

        <b-field label="Description">
            <b-input placeholder="Brown eyes, plump sexy lips, freckles..." maxlength="200" type="textarea" v-model="partner.description"></b-input>
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
            icon="calendar-today">
        </b-datepicker>
        </b-field>
      </section>
      <footer class="modal-card-foot footer-buttons">
            <button class="button" type="button" v-on:click="$parent.closeEdit()">Close</button>
            <button class="button is-primary" @click="updatePartner()">Edit</button>
      </footer>
    </div>
        </b-modal>
</template>
<script>
import moment from 'moment';
const fb = require('../firebaseConfig.js');

export default {
  data() {
    return {
      childPartner: {
        name: '',
        gender: '',
        location: '',
        approxDateMet: new Date(),
        description: '',
      },
    };
  },
  props: {
    partner: {
      type: Object,
    },
  },
  methods: {
    updatePartner() {
      this.$store.dispatch('updatePartner', this.partner)
      .then(() => this.$parent.closeEdit();)
      .catch(error => console.error(error));
    },
  },
};
</script>
<style scoped>
.gender-select {
  display: flex;
  justify-content: center;
}
.footer-buttons {
  justify-content: center;
}
</style>