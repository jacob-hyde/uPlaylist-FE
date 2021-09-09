<template>
  <div>
    <div ref="header" class="header">
      <v-container>
        <h1 class="h1">Largest Playlisting Network</h1>
        <h3 class="h3">Over 3,000 playlists | One Network | Trusted by 100k+ Artists</h3>
      </v-container>
    </div>
    <div class="featured" :style="`background-image: url(${featured.img_url})`">
      <div class="featured-container">
        <v-container class="container">
          <v-row align="center">
            <v-col md="4" sm="3" offset-md="2">
              <img
                :src="featured.img_url"
                :alt="featured.name"
              />
            </v-col>
            <v-col cols="6">
              <h2 class="h2">{{ featured.name }}</h2>
              <h4 class="h4">{{ featuredGenres }}</h4>
              <div class="boxed-container">
                <span class="boxed">{{ featured.placement }}% Placement</span>
                <span class="boxed">{{ featured.followers }} Followers</span>
              </div>
              <div class="mt-4">
                <v-btn v-if="!isInCart(featured.id)" color="primary" @click="ADD_TO_CART(featured)">
                  <v-icon>
                    mdi-cart
                  </v-icon>
                  &nbsp;{{ featured.price | centsToDollar }}
                </v-btn>
                <v-btn v-else color="red" @click="REMOVE_FROM_CART(featured)">Remove From Cart</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  async asyncData ({ $axios }) {
    try {
      const {data: {data}} = await $axios.get('curator/playlist/featured');
      return {
        featured: data,
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  },
  computed: {
    ...mapGetters({
      cart: 'cart/getCart',
    }),
    featuredGenres () {
      const genres = this.featured.genres.reduce((accum, v) => {
        return accum + v.name + ', '
      }, '')
      return genres.slice(0, -2)
    },
  },
  mounted () {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
      case 'sm':
        this.$refs.header.style.backgroundImage = 'url(/img/header-sm.jpg)'
        break;
      case 'md':
        this.$refs.header.style.backgroundImage = 'url(/img/header-md.jpg)'
        break;
      default:
        this.$refs.header.style.backgroundImage = 'url(/img/header.jpg)'
        break;
    }
  },
  methods: {
    ...mapMutations({
      ADD_TO_CART: 'cart/ADD_TO_CART',
      REMOVE_FROM_CART: 'cart/REMOVE_FROM_CART',
    }),
    isInCart (id) {
      return this.cart.findIndex(v => v.id === id) !== -1
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #000;
  background-size: cover;
  background-position: top center;
  height: 300px;
  padding-top: 100px;
  h3 {
    text-transform: uppercase;
  }
  @media screen and (max-width: 1264px) {
    height: 150px;
    padding-top: 30px;
    text-align: center;
    h1 {
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1rem;
    }
  }
}
.featured {
  background-color: #000;
  background-size: cover;
  background-position: center;
  .featured-container {
    backdrop-filter: blur(5px) brightness(0.5);
    padding-top: 50px;
    img {
      border-radius: 8px;
      max-width: 100%;
      max-height: 200px;
    }
    h2, h4 {
      margin-bottom: 10px;
    }
    .boxed {
      display: inline-block;
      font-size: 0.8rem;
      padding: 10px;
      border: 1px solid #fff;
      border-radius: 8px;
      text-align: center;
    }
  }
}
</style>
