<template>
    <b-modal :active.sync="$parent.isModalActive" has-modal-card>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Partner</p>
      </header>
      <section class="modal-card-body">

        <b-field label="Name/Nickname">
          <b-input type="text" v-model.trim="name" placeholder="Guy from Tinder" required></b-input>
        </b-field>

        <b-field label="Gender">
            <b-select placeholder="Male" v-model="gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
            </b-select>
        </b-field>

        <b-field label="Description">
            <b-input maxlength="200" type="textarea" v-model="description"></b-input>
        </b-field>

        <b-field label="Location Met">
          <b-input
            type="text"
            v-model.trim="location"
            placeholder="London, England"
            required
          ></b-input>
        </b-field>

        <b-field label="Select a date">
        <b-datepicker
            type="month"
            placeholder="Click to select..."
            v-model="approxDateMet"
            icon="calendar-today">
        </b-datepicker>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" v-on:click="$parent.close()">Close</button>
        <button class="button is-primary" @click="createPartner()">Add</button>
      </footer>
    </div>
        </b-modal>
</template>
<script>
const fb = require('../firebaseConfig.js');

export default {
  data() {
    return {
      name: '',
      gender: '',
      location: '',
      approxDateMet: new Date(),
      description: '',
    };
  },
  methods: {
      createPartner() {
        fb.partnersCollection.add({
            createdOn: new Date(),
            userId: this.$store.state.currentUser.uid,
            name: this.name,
            gender: this.gender,
            location: this.location,
            approxDateMet: this.approxDateMet,
            description: this.description,
        }).then((ref) => {
            this.$parent.close();
        }).catch((error) => {
            console.log(error);
        });
      },
  },
};
</script>
<style scoped>
</style>