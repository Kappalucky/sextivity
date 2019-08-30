<template>
  <div>
    <h1 class="dashboard-heading">Overview</h1>
    <hr />

    <!-- Section cards -->
    <section class="overview">
      <div class="container is-widescreen">
        <div class="columns is-mobile">
          <div class="column">
            <div class="card">
              <span class="overview-number">{{partners.length}}</span>
              <p class="overview-text">Partners</p>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <span class="overview-number">{{sexAmount}}</span>
              <p class="overview-text">times had sex</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- End Section Cards -->

    <!-- Partners Datatable -->
    <section class="partners">
      <h1>List of Partners</h1>
      <b-field grouped group-multiline>
        <b-select v-model="perPage">
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="15">15 per page</option>
          <option value="20">20 per page</option>
        </b-select>
        <div class="control add-button">
          <button class="button is-primary" @click="isModalActive = true">Add Partner</button>
        </div>
      </b-field>

      <b-table
        :data="partners"
        :paginated="isPaginated"
        :per-page="perPage"
        :current-page.sync="currentPage"
        pagination-position="bottom"
        default-sort-direction="desc"
        sort-icon="chevron-up"
        sort-icon-size="is-small"
        default-sort="user.first_name"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
      >
        <template slot-scope="props">
          <b-table-column
            field="partners.name"
            label="Name/Nickname"
            sortable
          >{{ props.row.name }}</b-table-column>

          <b-table-column label="Gender"
          centered>
            <span>
              <b-icon pack="fas" :icon="partners.gender === 'Male' ? 'fa-mars' : 'fa-venus'"></b-icon>
              {{ props.row.gender }}
            </span>
          </b-table-column>

          <b-table-column
            field="user.last_name"
            label="Location"
            sortable
            centered
          >{{ props.row.location }}</b-table-column>

          <b-table-column field="seconds" label="Date Met" sortable centered>
            <span class="tag is-success">{{ formatDate(props.row.approxDateMet.seconds) }}</span>
          </b-table-column>

          <b-table-column centered>
            <span class="partners-table-buttons">
              <button class="button is-primary" @click="partnerEdit(props.row.id)">Edit</button>
              <button class="button is-danger" @click="partnerDelete(props.row.id)">Delete</button>
            </span>
          </b-table-column>
        </template>
      </b-table>
    </section>
    <!-- End Partners Datatable -->

    <!-- Add Partner Modal -->
    <section class="partner-modal-add">
      <add-partner-modal />
    </section>
    <!-- End Partner Modal -->

    <!-- Edit Partner Modal -->
    <section class="partner-modal-edit">
      <edit-partner-modal :partner = "partner" />
    </section>
    <!-- End Edit Partner Modal -->

    <!-- Calendar Component -->
    <section class="calendar">
      <h1>Calendar</h1>
    </section>
    <!-- End Calendar Component -->

  </div>
</template>
<script>
import moment from 'moment';
import AddPartnerModal from '@/components/AddPartnerModal.vue';
import EditPartnerModal from '@/components/EditPartnerModal.vue';

const fb = require('../firebaseConfig.js');

export default {
  name: 'Dashboard',
  components: {
    AddPartnerModal,
    EditPartnerModal,
  },
  data() {
    return {
      sexAmount: 17,
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 5,
      isModalActive: false,
      editPartnerModal: false,
      partner: {
        id: '',
        name: '',
        gender: '',
        location: '',
        approxDateMet: new Date(),
        description: '',
      },
    };
  },
  computed: {
    partners() {
      return this.$store.state.partners;
    },
  },
  methods: {
    close() {
      this.isModalActive = !this.isModalActive;
    },
    closeEdit() {
      this.editPartnerModal = !this.editPartnerModal;
    },
    partnerEdit(id) {
      // Search partner array by id number which is the index number
      let created = this.$store.state.partners[id].createdOn;

      // Search partners collection using timestamp to obtain uid, save to data()
      fb.partnersCollection.where('createdOn', '==', created).get().then((docs) => {
        docs.forEach((doc) => {
          this.partner.id = doc.id;
        });
      });

      // Assign entire partner instance to data()
      const partnerObject = this.$store.state.partners[id];
      this.partner = Object.assign({}, partnerObject);

      // Convert partner instance UNIX timestamp to Date
      let partnerDate = moment.unix(this.partner.approxDateMet.seconds);
      this.partner.approxDateMet = moment(partnerDate).toDate();

      // Open Modal
      this.editPartnerModal = true;
    },
    partnerDelete(id) {
      // Search partner array by id number which is the index number
      let created = this.$store.state.partners[id].createdOn;

      // Search partners collection using timestamp to obtain uid, save to data()
      fb.partnersCollection.where('createdOn', '==', created).get().then((docs) => {
        docs.forEach((doc) => {
          this.$store.commit("setPartnerId" ,doc.id);
        });
      });

      console.log(this.$store.state.partnerId);
      // Using saved uid, delete specific partners information
      fb.partnersCollection.doc(this.$store.state.partnerId).delete()
      .then(() => {
        this.partner = {};
        console.log("document deleted");
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    },
    formatDate(date) {
      let unix = moment.unix(date);
      return moment(unix).format("MMM YYYY");
    }
  },
};
</script>

<style scoped>
.dashboard-heading {
  font-size: 2rem;
}
.overview {
  margin: 1rem;
  padding: 1rem;
}
.overview-number {
  font-size: 3rem;
  font-weight: 500;
}
.overview-text {
  font-size: 1rem;
  font-weight: 300;
  font-family: sans-serif;
  text-align: center;
  text-transform: capitalize;
}
.partners {
  margin: 1rem;
  padding: 1rem;
}
.partners-table-buttons > button {
  margin: 5px;
}
.add-button {
  margin-left: auto;
}
.tag.is-success {
  padding-left: 5px;
  padding-right: 5px;
  width: 100%;
}
</style>