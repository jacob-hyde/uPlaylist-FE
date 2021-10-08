import colors from 'vuetify/es5/util/colors';
require('dotenv').config();

export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s - uPlaylist',
		title: 'uPlaylist',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' },
			{ name: 'facebook-domain-verification', content: 'pua667apc5fxlfvp1mogi2u616vmqh' }
		],
		link: [
			{
				rel: 'icon',
				type: 'image/x-icon',
				href: '/favicon.ico'
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png'
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png'
			},
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-touch-icon.png'
			}
		]
	},

	env: process.env,

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [ '@/assets/app.scss' ],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'plugins/common',
		'@/plugins/filters.js',
		'plugins/validationMixin',
		'@/plugins/gtm.js',
		{ src: '~/plugins/paypal.js', ssr: false, mode: 'client' },
		{ src: '~/plugins/persistedState.js', ssr: false },
		{ src: '~/plugins/phoneInput.js' },
		{ src: '~/plugins/echo', mode: 'client' }
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'@nuxtjs/toast',
		'@nuxtjs/auth-next',
		'@nuxtjs/gtm',
		'@nuxtjs/sentry',
		[
			'nuxt-stripe-module',
			{
				publishableKey: process.env.STRIPE_KEY
			}
		],
		[
			'~/modules/fb',
			{
				track: 'PageView',
				eventUrl: process.env.API_URL + 'pixel-event',
				pixelId: process.env.FACEBOOK_PIXEL_ID,
				autoPageView: true,
				disabled: process.env.NODE_ENV === 'development',
				debug: process.env.NODE_ENV === 'development'
			}
		]
	],

	gtm: {
		enabled: process.env.NODE_ENV !== 'development',
		debug: process.env.NODE_ENV === 'development',
		pageTracking: true
	},

	axios: {
		baseURL: process.env.API_URL
	},

	toast: {
		position: 'top-right'
	},

	sentry: {
		dsn: process.env.SENTRY_DSN,
		publishRelease: true,
		sourceMapStyle: 'hidden-source-map',
		config: {
			release: process.env.SENTRY_RELEASE
		}
	},

	auth: {
		redirect: {
			login: '/login',
			logout: '/',
			callback: '/',
			home: false
		},
		strategies: {
			local: {
				token: {
					property: 'data.token'
				},
				user: {
					property: 'data'
				},
				endpoints: {
					login: {
						url: 'auth/login',
						method: 'post',
						propertyName: 'token'
					},
					logout: { url: 'auth/logout', method: 'delete' },
					user: { url: 'auth/user', method: 'get' }
				}
			}
		}
	},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: [ '~/assets/variables.scss' ],
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: '#6fd446',
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3
				}
			}
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {}
};
