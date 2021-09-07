<template>
  <div class="payment-wrap" :class="{ disabled: disabled }">
    <!--existing card::end-->
    <v-row v-if="!selectedPaymentMethod" class="my-2">
      <v-col cols="12">
        <div class="stripe-wrap">
          <v-alert v-if="validationErrors" type="error">
            {{ validationErrors }}
          </v-alert>
          <div
            v-if="paymentOptions.indexOf('stripe') !== -1"
            ref="card"
            class="StripePayment"
          />
          <v-tooltip top max-width="300" class="payment-cvc-tooltip">
            <template #activator="{ on }">
              <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
              <span class="payment-cvc-hint">CVC</span>
            </template>
            A three digit code, usually found on the back of your card, used to
            verify the validity of your card.
          </v-tooltip>

          <v-btn
            class="pay-btn"
            color="success"
            name="pay"
            :disabled="loading"
            @click="
              subscription ? doStripeRecurringPayment() : doStripePayment()
            "
          >
            <span v-if="!loading">{{
              subscription ? "Subscribe" : "Pay"
            }}</span>
            <span v-if="loading">
              <i class="fas fa-circle-notch fa-spin" aria-hidden="true" />
              Processing...
            </span>
          </v-btn>
        </div>
        <p v-if="paymentOptions.length > 1" class="text-center my-2">Or</p>
        <div v-if="paymentOptions.indexOf('paypal') !== -1" class="my-2">
          <paypal-buttons
            :env="env"
            :client="paypalClient"
            :create-order="paypalCreateOrder"
            :on-approve="paypalOnApprove"
          ></paypal-buttons>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
let elements
let card
let global
export default {
  props: {
    paymentUrl: {
      type: String,
      default: null,
    },
    // eslint-disable-next-line vue/require-prop-types
    paymentData: {
      default: null,
    },
    paymentConfig: {
      type: Object,
      default: () => ({}),
    },
    paymentOptions: {
      type: Array,
      default () {
        return ["stripe", "paypal"]
      },
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    canPay: {
      type: Boolean,
      default: true,
    },
    paymentUpdateUrl: {
      type: String,
      default: "v1/payment",
    },
    paymentUpdateMethod: {
      type: String,
      default: "PUT",
    },
    type: {
      type: String,
      default: null,
    },
    price: {
      type: [Number, String],
      default: null,
    },
  },
  data () {
    return {
      selected: "paypal",
      key: null,
      loading: null,
      validationErrors: null,
      selectedPaymentMethod: null,
      paymentMethodsRes: [],
      processingExistingPayment: false,
      env: process.env.NODE_ENV === "production" ? "production" : "sandbox",
      paypalClient: {
        sandbox: process.env.PAYPAL_CLIENT_ID,
        production: process.env.PAYPAL_CLIENT_ID,
      },
    }
  },
  computed: {
    paymentMethods () {
      const results = []
      const uniqueCards = []
      this.paymentMethodsRes.forEach(function (item) {
        if (!uniqueCards.includes(item.last4)) {
          const itemObj = {
            id: item.id,
            text: `${item.brand} - x${item.last4} ${item.exp_month}/ ${item.exp_year}`,
          }
          results.push(itemObj)
          uniqueCards.push(item.last4)
        }
      })
      return results
    },
  },
  mounted () {
    if (global === undefined) {
      // eslint-disable-next-line no-var
      global = window
    }
    elements = this.$stripe.elements()
    if (this.paymentOptions.includes("stripe")) {
      card = elements.create("card")
      card.mount(this.$refs.card)
    }
  },
  beforeDestroy () {
    if (this.paymentOptions.includes("stripe")) {
      card.destroy(this.$refs.card)
      this.card = undefined
    }
  },
  methods: {
    paypalCreateOrder (data, actions) {
      if (!this.canPay) {
        this.$emit("payment-attempted")
        this.loading = false
        return
      }
      return this.$axios
        .post(
          this.generateCreateOrderUrl("paypal"),
          this.paymentData,
          this.paymentConfig
        )
        .then((response) => {
          this.key = response.data.data.key
          return response.data.data.payment_id
        })
        .catch((err) => this.throwError(err))
    },
    paypalOnApprove (data, actions) {
      return this.updatePayment({ payer_id: data.payerID })
    },
    async getExistingPaymentMethods () {
      this.processingExistingPayment = true
      try {
        const response = await this.$axios.get(`v1/user/payment/methods`)
        this.paymentMethodsRes = response.data
      } catch (err) {
        this.$noty.warning("Error Occured while processing request.")
      }
      this.processingExistingPayment = false
    },
    generateCreateOrderUrl (paymentProcessor) {
      this.loading = true
      this.$emit("toggle-loading", true)
      let url = this.paymentUrl + `?payment=${paymentProcessor}`
      if (this.key) {
        url += `&key=${this.key}`
      }
      return url
    },
    async updatePayment (postData, config = {}) {
      const couponId =
        this.paymentData instanceof FormData
          ? this.paymentData.get("coupon_id")
          : this.paymentData.coupon_id
      postData = { ...postData, ...this.getFacebookCookies() }
      postData.recurring = this.subscription
      postData.coupon_id = couponId;
      this.validationErrors = null
      const {
        data: { data: event },
      } = await this.$axios.get("pixel-event")
      try {
        const {
          data: { data },
        } = await this.$axios({
          method: this.paymentUpdateMethod,
          url: `${this.paymentUpdateUrl}/${this.key}`,
          data: postData,
          ...config,
        })
        if (data.status !== "paid") {
          this.loading = false
          this.validationErrors = data
          this.$emit("payment-error", this.validationErrors)
          return
        }
        data.selected = this.selected
        this.$emit("payment-success", data)
        this.$gtm.push({ event: this.type, value: this.price })
        this.$fb.track(
          "Purchase",
          { currency: "USD", value: this.price },
          event.event_id
        )
        this.loading = false
      } catch (err) {
        this.loading = false
        this.validationErrors = err
        this.$emit("toggle-loading", false)
        this.$sentry.captureException(err)
      }
      this.$emit("toggle-loading", false)
    },
    async doStripePayment () {
      this.selected = "stripe"
      const cardOptions = {}
      let paymentApiUrl = ""
      this.validationErrors = null
      try {
          cardOptions.payment_method = {
            card,
          }
          paymentApiUrl = this.generateCreateOrderUrl("stripe")
        if (!this.canPay) {
          this.$emit("payment-attempted")
          this.loading = false
          return
        }
        const response = await this.$axios.post(
          paymentApiUrl,
          this.paymentData,
          this.paymentConfig
        )
        const responseData = response.data.data
        if (
          // eslint-disable-next-line no-prototype-builtins
          responseData.hasOwnProperty("success") &&
          responseData.success === false
        ) {
          // eslint-disable-next-line no-prototype-builtins
          if (responseData.hasOwnProperty("error_detail")) {
            this.validationErrors = responseData.error_detail
            this.loading = false
          }
        } else {
          this.key = response.data.data.key
          const paymentId = response.data.data.payment_id
          // TODO -- do we need the variable paymentIntent here?
          const { error } =
            await this.$stripe.confirmCardPayment(paymentId, cardOptions)
          if (error) {
            this.loading = false
            this.validationErrors = error.message
            this.$emit("payment-error", error)
            this.$emit("toggle-loading", false)
            return
          }
          this.updatePayment({})
        }
      } catch (err) {
        this.$emit("payment-error", err)
        this.loading = false
        this.$emit("toggle-loading", false)
        this.$sentry.captureException(err)
      }
      this.processingExistingPayment = false
    },
    async doStripeRecurringPayment () {
      this.validationErrors = null
      this.selected = "stripe"
      const {
        data: { data },
      } = await this.$axios.post(
        this.generateCreateOrderUrl("stripe"),
        this.paymentData,
        this.paymentConfig
      )
      this.key = data.key
      const { error, setupIntent } = await this.$stripe.confirmCardSetup(
        data.payment_id,
        {
          payment_method: {
            card,
          },
        }
      )
      if (error) {
        this.loading = false
        this.validationErrors = error.message
        return
      }
      this.updatePayment({ payment_method: setupIntent.payment_method })
    },
  },
}
</script>

<style lang="scss" scoped>
.disabled {
  position: relative;
  &:after {
    content: " ";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }
}
.pay-btn {
  margin-top: 4px;
  width: 100%;
  border-radius: 4px;
  font-family: Verdana, Geneva, sans-serif;
}
.StripeElement {
  box-sizing: border-box;
  height: 40px;
  padding: 10px 12px;
  margin: 10px 0 10px 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}
.StripePayment label {
  font-family: "Montserrat", sans-serif;
  color: #3d2151;
}
.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}
.StripeElement--invalid {
  border-color: #fa755a;
}
.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
.payment-cvc-hint {
  font-size: 10px;
}
#paypal-button {
  padding: 0 0 20px;
}
</style>
