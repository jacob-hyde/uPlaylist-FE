<template>
  <div>
    <div v-if="paymentSuccess">
      <div class="text-center">
        <v-icon aria-hidden="true"> mdi-check-circle-outline </v-icon>
      </div>
      <h3 class="h3 text-center">Thank you for your purchase!</h3>
      <p class="body-1 text-center">
        Your song has been sent to the playlist owners for review. Stay tuned to
        your email for updates!
      </p>
      <p class="text-center">
        No placement can be guaranteed based spotifys guidelines.
      </p>
    </div>
    <div v-else>
      <v-row>
        <v-col md="6">
          <v-alert
            v-if="genreMismatches.length > 0"
            class="text-warning text-center mismatch"
          >
            Your selected track genre does not match any genres from the
            following playlist(s):
            {{
              // eslint-disable-next-line vue/no-parsing-error
              genreMismatches.length < 2
                ? genreMismatches[0]
                : genreMismatches.join(', ')
            }}
          </v-alert>
          <payment
            class="payment-wrap"
            :payment-url="paymentUrl"
            :payment-data="paymentData"
            :show-payment-methods="total > 0"
            :payment-method-url="paymentUrl"
            type="curatorcheckout"
            :price="Math.floor(total) / 100"
            :payment-options="paymentOptions"
            payment-update-url="payment"
            @payment-success="onPaymentSuccess"
            @payment-error="onPaymentError"
          />
          <v-alert v-if="orderError !== null" color="red" type="warning">{{
            orderError
          }}</v-alert>
        </v-col>
        <v-col md="6">
          <playlist
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
            :view-only="true"
          />
          <div v-if="total" class="row flex-column total-price-parent">
            <div class="col">
              <p class="text-right total-price p-2 m-0">
                Fee: {{ fee | centsToDollar }}
                <br />
                Total Price: {{ total | centsToDollar }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-if="!paymentSuccess" class="d-flex">
      <v-btn text color="primary" name="back" @click="$emit('back-step')"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Playlist from '@/components/Playlist.vue'
import Payment from '@/components/Payment.vue'

export default {
  components: {
    Playlist,
    Payment,
  },
  props: {
    track: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      paymentUrl: 'curator/order',
      paymentSuccess: false,
      orderError: null,
    }
  },
  computed: {
    ...mapGetters({
      playlists: 'cart/getCart',
    }),
    subTotal() {
      return this.playlists.reduce((accum, val) => {
        accum += val.price
        return accum
      }, 0)
    },
    fee() {
      return this.subTotal * 0.3 + 50
    },
    total() {
      return this.subTotal + this.subTotal * 0.3 + 50
    },
    paymentData() {
      const playlistIds = this.playlists.reduce((accum, val) => {
        accum.push(val.id)
        return accum
      }, [])
      return {
        user_track_uuid: this.track.uuid,
        playlists: playlistIds,
      }
    },
    genreMismatches() {
      const playlistMismatches = []
      this.playlists.forEach((playlist) => {
        let noMatches = true
        playlist.genres.forEach((genre) => {
          if (genre.name === this.track.genre) {
            noMatches = false
          }
        })
        if (noMatches) {
          playlistMismatches.push(playlist.name)
        }
      })
      return playlistMismatches
    },
    paymentOptions() {
      if (this.$route.path !== '/playlists') {
        return ['stripe']
      }
      return ['stripe', 'paypal']
    },
  },
  async created() {
    const selectedIds = this.playlists.reduce((accum, v) => {
      accum.push(v.id)
      return accum
    }, [])

    try {
      const {
        data: { data },
      } = await this.$axios.get(`curator/playlist?ids=${selectedIds.join(',')}`)

      if (data.length !== selectedIds.length) {
        data.forEach((v) => {
          this.ADD_TO_CART(v)
        })
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  },
  methods: {
    ...mapMutations({
      ADD_TO_CART: 'cart/ADD_TO_CART',
    }),
    onPaymentSuccess() {
      this.$store.dispatch('cart/clearCart')
      this.paymentSuccess = true
      this.$emit('payment-success')
    },
    onPaymentError(error) {
      let err = error.message ? error.message : 'Something went wrong'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstFieldErrors = errors[Object.keys(errors)[0]]
        err = firstFieldErrors ? firstFieldErrors[0] : err.response.data.message
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.data
      ) {
        err = error.response.data.data.message
      }
      this.orderError = err
    },
    formatPrice(value) {
      const val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
  },
}
</script>

<style lang="scss" scoped>
.checkout-wrap {
  display: flex;
  justify-content: space-between;
  .payment-wrap {
    width: 50%;
    margin-right: 15px;
  }
  .playlists-wrap {
    flex-grow: 1;
  }
}
.fa-6 {
  font-size: 5em;
}
.mismatch {
  font-size: 12px;
}
.total-price {
  font-weight: bold;
}
.total-price-parent {
  margin-bottom: 10px;
}
</style>
