import Vue from "vue"
import cookie from "js-cookie"

function whenAvailable(name, callback) {
  const interval = 10
  window.setTimeout(function () {
    if (window[name]) {
      callback(window[name])
    } else {
      whenAvailable(name, callback)
    }
  }, interval)
}

Vue.mixin({
  methods: {
    getFacebookCookies () {
      return { _fbp: cookie.get("_fbp"), _fbc: cookie.get("_fbc") }
    },
    throwError (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      this.$sentry.captureException(err)
    },
    whenAvailable (name, callback) {
      const interval = 10
      window.setTimeout(function () {
        if (window[name]) {
          callback(window[name])
        } else {
          whenAvailable(name, callback)
        }
      }, interval)
    },
    mapObject (obj, fn) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
      )
    },
    roundNumber(value, decimals) {
      return Number(Math.round(value + "e" + decimals) + "e-" + decimals)
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0
          const v = c === "x" ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }
      )
    },
  },
})
