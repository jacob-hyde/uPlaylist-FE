<template>
  <div>
    <div class="playlist" :style="`background-image: url(${playlist.img_url})`">
      <div class="playlist-container">
        <v-container class="container">
          <v-row align="center">
            <v-col md="4" sm="3" offset-md="2">
              <img :src="playlist.img_url" :alt="playlist.name" />
            </v-col>
            <v-col cols="6">
              <h1 class="h1">{{ playlist.name }}</h1>
              <h4 class="h4">{{ genres }}</h4>
              <div class="boxed-container">
                <span class="boxed">{{ playlist.placement }}% Placement</span>
                <span class="boxed">{{ playlist.followers }} Followers</span>
              </div>
              <div class="mt-4">
                <v-btn color="primary" @click="follow(playlist)">
                  Follow
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <v-container>
      <h2 class="h2 mb-4">Tracks</h2>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th></th>
              <th class="text-left">Name</th>
              <th class="text-left">Artist</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="track in playlist.tracks" :key="track.name">
              <td style="padding-top: 10px; padding-bottom: 10px">
                <img :src="track.img_url" :alt="track.name" height="70px" />
              </td>
              <td>{{ track.name }}</td>
              <td>{{ track.artist }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  async asyncData({ params, $axios }) {
    try {
      const {
        data: { data },
      } = await $axios.get(`curator/playlist/${params.slug}`)
      return {
        playlist: data,
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
    genres() {
      const genres = this.playlist.genres.reduce((accum, v) => {
        return accum + v.name + ', '
      }, '')
      return genres.slice(0, -2)
    },
  },
  methods: {
    ...mapMutations({
      ADD_TO_CART: 'cart/ADD_TO_CART',
      REMOVE_FROM_CART: 'cart/REMOVE_FROM_CART',
    }),
    isInCart(id) {
      return this.cart.findIndex((v) => v.id === id) !== -1
    },
    async follow(playlist) {
      if (!this.$auth.loggedIn) {
        window.alert('You need to be logged in to follow a playlist')
        return
      }
      try {
        await this.$axios.put('spotify/follow/' + playlist.id)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.playlist {
  background-color: #000;
  background-size: cover;
  background-position: center;
  .playlist-container {
    backdrop-filter: blur(5px) brightness(0.5);
    padding-top: 50px;
    img {
      border-radius: 8px;
      max-width: 100%;
      max-height: 200px;
    }
    h2,
    h4 {
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
