<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <v-card>
          <v-card-title>
            <span class="headline">Payout</span>
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <h3 class="h3">Current Payout Amount: $<strong>{{ $auth.user.payout }}</strong></h3>
              <p>
                Payout by Paypal to: <strong>{{ $auth.user.paypal_email }}</strong>
              </p>
              <v-btn color="primary" @click="payout">Payout</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'dashboard',
  methods: {
    async payout() {
      try {
        await this.$axios.post('payment/payout');
        await this.$auth.fetchUser();
        this.$toast.success('Payout successful!');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  },
}
</script>

<style>

</style>
