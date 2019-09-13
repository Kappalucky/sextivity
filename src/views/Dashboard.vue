<template>
  <div class="dashboard">
    <section class="dashboard-heading">
      <h1 class="dashboard-heading-title">Overview</h1>
      <hr />
    </section>
    <section class="container is-widescreen dashboard-body">
      <!-- Section cards -->
      <section class="section overview">
        <div class="columns is-mobile">
          <div class="column">
            <div class="card">
              <span class="overview-number">{{partners.length}}</span>
              <p class="overview-text">Partners</p>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <span class="overview-number">{{sex.length}}</span>
              <p class="overview-text">times had sex</p>
            </div>
          </div>
        </div>
      </section>
      <br />
      <!-- End Section Cards -->

      <!-- Calendar Component -->
      <calendar />
      <br />
      <!-- End Calendar Component -->

      <!-- Partners Datatable -->
      <section class="section partners">
        <h1>List of Partners</h1>
        <b-field grouped group-multiline>
          <!-- TO-DO: Need to make selection options dynamic based on partner array length -->
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

            <b-table-column label="Gender" centered>
              <span>
                <b-icon pack="fas" :icon="partners.gender === 'Male' ? 'fa-mars' : 'fa-venus'"></b-icon>
                {{ props.row.gender }}
              </span>
            </b-table-column>

            <b-table-column
              field="partners.location"
              label="Location"
              sortable
              centered
            >{{ props.row.location }}</b-table-column>

            <b-table-column field="partners.rating" label="Rating" sortable centered>
              <template v-if="props.row.rating">{{ props.row.rating.toFixed(2) }}</template>
              <template v-else>No rating yet</template>
            </b-table-column>

            <b-table-column field="seconds" label="Date Met" sortable centered>
              <span class="tag is-success">{{ formatDate(props.row.approxDateMet) }}</span>
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
      <!-- End Add Partner Modal -->

      <!-- Edit Partner Modal -->
      <section class="partner-modal-edit">
        <edit-partner-modal />
      </section>
      <!-- End Edit Partner Modal -->
    </section>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import AddPartnerModal from '@/components/AddPartnerModal.vue';
import EditPartnerModal from '@/components/EditPartnerModal.vue';
import Calendar from '@/views/Calendar.vue';

export default {
	name: 'Dashboard',
	components: {
		AddPartnerModal,
		EditPartnerModal,
		Calendar,
	},
	data() {
		return {
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
		};
	},
	computed: {
		...mapState(['partners', 'sex']),
	},
	methods: {
		...mapActions(['getPartner', 'deletePartner']),
		close() {
			this.isModalActive = !this.isModalActive;
		},
		closeEdit() {
			this.editPartnerModal = !this.editPartnerModal;
		},
		partnerEdit(id) {
			// Sets partner object in store
			this.getPartner(id);
			// Open Modal
			this.editPartnerModal = true;
		},
		partnerDelete(id) {
			this.deletePartner(id)
				.then(() => {
					this.$buefy.snackbar.open({
						message: 'Partner deleted',
						type: 'is-success',
						position: 'is-top',
						actionText: null,
						indefinite: false,
					});
				})
				.catch(error => console.error(error));
		},
		formatDate(date) {
			return moment(date).format('MMM YYYY');
		},
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