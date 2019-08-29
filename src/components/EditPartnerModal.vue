<template>
    <b-modal :active.sync="$parent.editPartnerModal" has-modal-card>
    <div class="modal-card container">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Partner</p>
      </header>
      <section class="modal-card-body">

        <b-field label="Name/Nickname">
          <b-input type="text" v-model.trim="childPartner.name" placeholder="Guy from Tinder" required></b-input>
        </b-field>

        <b-field label="Gender">
            <b-select class="gender-select" placeholder="Gender" v-model="childPartner.gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
            </b-select>
        </b-field>

        <b-field label="Description">
            <b-input placeholder="Brown eyes, plump sexy lips, freckles..." maxlength="200" type="textarea" v-model="childPartner.description"></b-input>
        </b-field>

        <b-field label="Location Met">
          <b-input
            type="text"
            v-model.trim="childPartner.location"
            placeholder="London, England"
            required
          ></b-input>
        </b-field>

        <b-field label="Approximate Meeting Date">
        <b-datepicker
            type="month"
            placeholder="Click to select..."
            v-model="childPartner.approxDateMet"
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
      parentPartner: {
        type: Object,
      },
  },
  methods: {
      updatePartner() {
        // Using saved uid, update specific partners information
      fb.partnersCollection.doc(this.childPartner.id).update({
        updatedOn: new Date(),
        name: this.childPartner.name,
        gender: this.childPartner.gender,
        location: this.childPartner.location,
        approxDateMet: this.childPartner.approxDateMet,
        description: this.childPartner.description,
      }).then(() => {
        this.$parent.closeEdit();
      }).catch((error) => {
        console.log(error);
      });
      },
  },
  beforeMount() {
    this.childPartner = this.parentPartner;
  },
  destroy() {
    this.childPartner = {};
  }
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