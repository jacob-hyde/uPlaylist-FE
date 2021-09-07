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
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      tab: 0,
      loading: false,
      headers: [
        { text: 'Order ID', value: 'uuid' },
        { text: 'Track Name', value: 'user_track.name' },
        { text: 'Link', value: 'user_track.url' },
        { text: 'Playlist Name', value: 'playlist.name' },
        { text: 'Price', value: 'playlist_price' }
      ],
      orders: [],
    }
  },
  computed: {
    status () {
      return this.tab === 0 ? 'pending' : 'completed'
    }
  },
  watch: {
    status () {
      this.getOrders()
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    async getOrders () {
      this.loading = true
      try {
        const {data: {data: orders}} = await this.$axios.get('curator/order?status=' + this.status)
        this.orders = orders
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
      this.loading = false
    },
  },
}
</script>

<style>

</style>
