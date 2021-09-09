<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>
        <span class="headline">Promote Playlist</span>
      </v-card-title>
      <v-card-text>
        <v-date-picker
          v-model="date"
          :allowed-dates="disabledDates"
        ></v-date-picker>
        <payment
          v-if="date"
          payment-url="curator/playlist/promote"
          payment-update-url="payment"
          :payment-data="{id: id, date: date}"
          @payment-success="onPaymentSuccess"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import Payment from '@/components/Payment.vue';
export default {
  components: {
    Payment
  },
  props: {
    id: {
      type: Number,
      default: null,
    }
  },
  data () {
    return {
      dialog: false,
      date: null,
      datesTaken: [],
    }
  },
  async created () {
    const {data: {data: {dates}}} = await this.$axios.get('curator/playlist/featured-dates')
    this.datesTaken = dates;
  },
  methods: {
    openModal () {
      this.dialog = true;
    },
    disabledDates (date) {
      return !this.datesTaken.includes(moment(date).format('YYYY-MM-DD')) && date >= new Date().toISOString().substr(0, 10)
    },
    onPaymentSuccess () {
      this.dialog = false;
      this.$toast.success('Purchase Successful!')
    },
  }
}
</script>

<style>

</style>
