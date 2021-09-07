<template>
  <div>
    <v-container>
      <v-row>
        <v-col md="6" offset-md="3">
          <v-card>
            <v-card-title class="justify-center">
              <span class="headline">Pro Subscription</span>
            </v-card-title>
            <v-card-text>
              <div class="text-center">
                <v-icon color="blue" x-large>mdi-check-decagram</v-icon>
                <h2 class="h2">$9.99/month</h2>
              </div>
              <ul>
                <li>15% fee instead of 50%</li>
                <li>Playlists get a verified blue check mark next to them</li>
                <li>4 days to review instead of 2</li>
                <li>Prices start at $5 instead of $1</li>
              </ul>
              <div class="text-center mt-4">
                <v-btn v-if="!$auth.user.subscribed" color="primary" @click="dialog = true">Sign Up</v-btn>
                <v-btn v-else color="red" @click="cancelSubscription">{{
                  $auth.user.subscription_ends_at ? 'Ends ' + formatEndDate($auth.user.subscription_ends_at) : 'Cancel Subscription'
                }}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title>
          <span class="headline">Subscribe to Pro</span>
        </v-card-title>
        <v-card-text>
          <div class="my-5 d-flex justify-center">
            <v-checkbox
              v-model="agreeStatus"
              required
            >
              <div slot="label">
                I agree with the
                <a :href="termConditionsUrl" target="_blank" @click.stop>&nbsp;Terms and Conditions</a> and <a :href="policyUrl" target="_blank" @click.stop>Privacy Policy</a>
              </div>
            </v-checkbox>
          </div>
          <payment
            :disabled="!agreeStatus"
             payment-url="subscription/plan"
            :payment-data="{plan_id: 1}"
            :subscription="true"
            :payment-options="[`stripe`]"
            type="curatorsubscription"
            :price="9.99"
            payment-update-url="payment"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import Payment from '@/components/Payment';
export default {
  components: {
    Payment,
  },
  layout: 'dashboard',
  data () {
    return {
      dialog: false,
      agreeStatus: false,
      termConditionsUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      policyUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  },
  methods: {
    async cancelSubscription () {
      try {
        await this.$axios.delete('subscription/' + this.$auth.user.subscription_id)
        await this.$auth.fetchUser();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    },
    formatEndDate (date) {
      return moment(date).format('MMMM Do YYYY');
    },
  },
}
</script>

<style lang="scss" scoped>
h2 {
  margin: 10px 0;
}
ul {
  list-style: none;
  min-width: 300px;
  margin-left: calc(50% - 115px);
}
</style>
