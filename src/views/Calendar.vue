<template>
  <div>
    <section class="section calendar">
      <h2>Calendar</h2>
      <p>
        <small>Click on date to add Sex Event</small>
      </p>
      <vue-calendar
        :show-limit="3"
        :events="events"
        @day-clicked="dayClicked"
        @event-clicked="eventClicked"
      ></vue-calendar>
    </section>
    <!-- Add Sex Modal -->
    <section class="sex-modal">
      <add-sex :calendarDate="calendarDate" />
    </section>
    <!-- End Add Sex Modal -->
    <!-- Edit Sex Modal -->
    <section class="sex-modal">
      <edit-sex />
    </section>
    <!-- End Edit Sex Modal -->
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import AddSex from '@/components/AddSex.vue';
import EditSex from '@/components/EditSex.vue';

export default {
	name: 'Calendar',
	components: {
		AddSex,
		EditSex,
	},
	data() {
		return {
			isModalActive: false,
			editSexModal: false,
			calendarDate: Date,
		};
	},
	computed: {
		...mapState(['sex', 'events']),
	},
	methods: {
		...mapActions(['getIndividualSex']),
		close() {
			this.isModalActive = !this.isModalActive;
		},
		closeEdit() {
			this.editSexModal = !this.editSexModal;
		},
		dayClicked(day) {
			// Create Event
			this.calendarDate = day.date;
			this.isModalActive = true;
		},
		eventClicked(event) {
			// Set sex object in store
			this.getIndividualSex(event.sexId);
			// Open modal
			this.editSexModal = true;
		},
	},
	created() {
		this.$calendar.eventBus.$on('day-clicked', day => this.dayClicked(day));
	},
};
</script>