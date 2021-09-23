<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="headline">Orders</span>
          </v-card-title>
          <v-tabs v-model="tab" centered>
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab>Pending</v-tab>
            <v-tab>Completed</v-tab>
          </v-tabs>
          <v-card-text>
            <v-data-table
              :loading="loading"
              :headers="headers"
              :items="orders"
              :items-per-page="25"
            >
              <template #[`item.action`]="{ item }">
                <v-btn color="primary" class="mr-2" @click="approve(item)"
                  >Approve</v-btn
                >
                <v-btn color="red" @click="decline(item)">Decline</v-btn>
              </template>
              <template #[`item.user_track.url`]="{ item }">
                <a :href="item.user_track.url" target="_blank">{{
                  item.user_track.url
                }}</a>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="feedbackDialog" max-width="300">
      <v-card>
        <v-card-title>
          <span class="headline">Feedback</span>
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="feedback"
            :auto-grow="true"
            label="Feedback"
            placeholder="Enter feedback here"
          ></v-textarea>
          <div class="text-center">
            <v-btn color="primary" @click="submitFeedback">Submit</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  layout: 'dashboard',
  middleware: 'auth',
  data() {
    return {
      tab: 0,
      loading: false,
      headers: [
        { text: 'Order ID', value: 'uuid' },
        { text: 'Track Name', value: 'user_track.name' },
        { text: 'Link', value: 'user_track.url' },
        { text: 'Playlist Name', value: 'playlist.name' },
        { text: 'Price', value: 'playlist_price' },
        { text: 'Action', value: 'action' },
      ],
      orders: [],
      selected: null,
      oStatus: null,
      feedback: null,
      feedbackDialog: false,
    }
  },
  computed: {
    status() {
      return this.tab === 0 ? 'pending' : 'completed'
    },
  },
  watch: {
    status() {
      this.getOrders()
    },
  },
  created() {
    this.getOrders()
  },
  methods: {
    async getOrders() {
      this.loading = true
      try {
        const {
          data: { data: orders },
        } = await this.$axios.get('curator/order?status=' + this.status)
        this.orders = orders
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
      this.loading = false
    },
    approve(order) {
      this.selected = order
      this.oStatus = 'approved'
      this.feedbackDialog = true
    },
    decline(order) {
      this.selected = order
      this.oStatus = 'declined'
      this.feedbackDialog = true
    },
    async submitFeedback() {
      try {
        await this.$axios.put(`curator/order/${this.selected.uuid}`, {
          status: this.oStatus,
          feedback: this.feedback,
        })
        this.getOrders()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
      this.selected = false
      this.feedbackDialog = false
      this.oStatus = null
      this.feedback = null
    },
  },
}
</script>

<style>
</style>
