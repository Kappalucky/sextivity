<template>
  <div>
    <section class="section calendar">
      <vue-calendar
        :show-limit="3"
        :events="sex"
        @day-clicked="dayClicked"
        @event-clicked="eventClicked"
      ></vue-calendar>
    </section>
    <!-- Add Partner Modal -->
    <section class="sex-modal-add">
      <add-sex :calendarDate="calendarDate" />
    </section>
    <!-- End Add Partner Modal -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import AddSex from '@/components/AddSex.vue';

export default {
	name: 'Calendar',
	components: {
		AddSex,
	},
	data() {
		return {
			isModalActive: false,
			calendarDate: Date,
		};
	},
	computed: {
		...mapState(['sex']),
	},
	methods: {
		close() {
			this.isModalActive = !this.isModalActive;
		},
		formatDate(date) {
			let unix = moment.unix(date);
			return moment(unix).format('MMM YYYY');
		},
		dayClicked(day) {
			// Create Event
			this.calendarDate = day.date;
			this.isModalActive = true;
			console.log(day);
			// day.date == date to log for sex object
		},
		eventClicked(event) {
			// Do something...
			console.log(event);
		},
	},
	created() {
		this.$calendar.eventBus.$on('day-clicked', day => this.dayClicked(day));
	},
};
</script>