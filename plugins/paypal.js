import Vue from "vue"
import { loadScript } from "@paypal/paypal-js"

loadScript({
  "client-id": process.env.PAYPAL_CLIENT_ID,
  "disable-funding": "card",
})
  .then((paypal) => {
    const PaypalButtons = paypal.Buttons.driver("vue", Vue)
    Vue.component("PaypalButtons", PaypalButtons)
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
  })

