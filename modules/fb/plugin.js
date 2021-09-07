import { Minimatch } from "minimatch"
import axios from "axios"
import cookie from "js-cookie"
// const lookup = require("country-code-lookup")

/**
 * @class Fb
 */
class Fb {
  constructor (fbq, options, eventUrl) {
    this.options = options
    this.fbq = fbq
    this.eventUrl = eventUrl

    this.isEnabled = !options.disabled
  }

  setPixelId (pixelId) {
    this.options.pixelId = pixelId
    this.init()
  }

  /**
   * @method enable
   */
  enable () {
    this.isEnabled = true
    this.init()
    this.track()
  }

  /**
   * @method disable
   */
  disable () {
    this.isEnabled = false
  }

  /**
   * @method init
   */
  init () {
    this.query('init', this.options.pixelId)
  }

  /**
   * @method track
   */
  async track (event = null, parameters = null, eventId = null) {
    if (!event) {
      event = this.options.track
    }

    if (this.eventUrl && !eventId) {
      if (localStorage.getItem('auth._token.local')) {
        axios.defaults.headers.common["Authorization"] = localStorage.getItem('auth._token.local');
      }
      try {
        let url = this.eventUrl
        const queryString = []
        if (event === "PageView") {
          queryString.push("url=" + window.location.href.split('?')[0])
          queryString.push("view=true")
        }
        if (cookie.get("_fbp")) {
          queryString.push(`_fbp=${cookie.get("_fbp")}`)
        }
        if (cookie.get("_fbc")) {
          queryString.push(`_fbc=${cookie.get("_fbc")}`)
        }
        if (queryString.length !== 0) {
          url += "?" + queryString.join("&")
        }
        const {data: {data}} = await axios.get(url)
        eventId = data.event_id
      } catch (err) {
        console.error(err)
      }
    }

    this.query('track', event, parameters, eventId)
  }

  /**
   * @method query
   * @param {string} cmd
   * @param {object} option
   * @param {object} parameters
   */
  query (cmd, option, parameters = null, eventId = null) {
    if (this.options.debug) log('Command:', cmd, 'Option:', option, 'Additional parameters:', parameters, 'Event Id:', eventId)
    if (!this.isEnabled) return

    if (!parameters && !eventId) {
      this.fbq(cmd, option)
    } else if (parameters && !eventId) {
      this.fbq(cmd, option, parameters)
    } else if (!parameters && eventId) {
      this.fbq(cmd, option, {}, {eventID: eventId})
    } else {
      this.fbq(cmd, option, parameters, {eventID: eventId})
    }
  }
}

function getMatchingPixel (options, path) {
  return options.pixels.find(pixel => {
    const routeIndex = pixel.routes.findIndex(route => {
      const minimatch = new Minimatch(route)
      return minimatch.match(path)
    })

    return routeIndex !== -1
  })
}

function log (...messages) {
  console.info.apply(this, ['[nuxt-facebook-pixel-module]', ...messages])
}

export default (ctx, inject) => {
  let _fbq
  const parsedOptions = <%= JSON.stringify(options) %>
  const isDev = parsedOptions.dev && !parsedOptions.debug

  if (isDev) log('You are running in development mode. Set "debug: true" in your nuxt.config.js if you would like to trigger tracking events in local.')

  const { path } = ctx.route
  const matchingPixel = getMatchingPixel(parsedOptions, path)

  const pixelOptions = Object.assign({}, matchingPixel || parsedOptions)

  /* eslint-disable */
  if (typeof window !== 'undefined') {
    ((f, b, e, v, n, t, s) => {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = pixelOptions.version;
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.defer = true;
      t.src = v;
      s = b.getElementsByTagName('body')[0];
      s.parentNode.appendChild(t, s);

      _fbq = fbq;

      if (!isDev && !pixelOptions.disabled) {
        if (pixelOptions.manualMode) {
          fbq('set', 'autoConfig', false, pixelOptions.pixelId)
        }
        fbq('init', pixelOptions.pixelId)
        fbq.disablePushState = true
        fbq.allowDuplicatePageViews = true
        // fbq('track', pixelOptions.track)
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }
  /* eslint-enable */

  const instance = new Fb(_fbq, pixelOptions, parsedOptions.eventUrl)

  if (ctx.app && ctx.app.router) {
    const router = ctx.app.router
    router.afterEach(({ path }) => {
      /**
       * Change the current pixelId according to the route.
       */
      const matchingPixel = getMatchingPixel(parsedOptions, path)

      const pixelOptions = Object.assign({}, matchingPixel || parsedOptions)
      if (pixelOptions.pixelId !== instance.options.pixelId) {
        instance.setPixelId(pixelOptions.pixelId)
      }

      // let params = {}
      // if (ctx.$auth.user) {
      //   const user = ctx.$auth.user.account;
      //   const userProps = {
      //     em: 'general.email',
      //     fn: 'general.fname',
      //     ln: 'general.lname',
      //     ph: 'general.phone',
      //     country: 'address.country',
      //     ct: 'address.city',
      //     st: 'address.state',
      //     zp: 'address.zipcode'
      //   };
      //   for (let key in userProps) {
      //     let value = userProps[key].split('.').reduce((o,i)=>o[i], user)
      //     if (value) {
      //       value = value.toLowerCase().trim()
      //       if (key === 'country') {
      //         value = lookup.byCountry(value)
      //         if (value) {
      //           params[key] = value.iso2
      //         }
      //       } else {
      //         params[key] = value
      //       }
      //     }
      //   }
      // }

      /**
       * Automatically track PageView
       */
      if (parsedOptions.autoPageView) {
        instance.track('PageView')
      }
    })
  }

  /* eslint-enable */
  ctx.$fb = instance
  inject('fb', instance)
}
