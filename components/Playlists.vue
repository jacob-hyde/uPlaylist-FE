<template>
  <div>
    <v-container>
      <v-row>
        <v-col v-if="$vuetify.breakpoint.mdAndUp" md="3">
          <v-card>
            <v-card-title class="d-flex justify-space-between mb-1">
              <span>Filters</span>
              <v-btn text color="primary" @click="clearFilters"
                >Clear filters</v-btn
              >
            </v-card-title>
            <v-card-text>
              <filters ref="filters" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="9" col="12">
          <v-data-table
            :headers="headers"
            :items="playlists"
            :items-per-page="25"
            :loading="loading"
            class="row-pointer"
            @pagination="onPage"
            @click:row="onRowClick"
          >
            <template #[`item.name`]="{ item }">
              <div class="name">
                <img :src="item.img_url" height="50px" />
                <span>
                  {{ item.name }}
                  <v-icon v-if="item.is_subscribed" color="blue"
                    >mdi-check-decagram</v-icon
                  >
                  <br />
                  <span class="small">{{
                    item.genres.map((genre) => genre.name).join(', ')
                  }}</span>
                </span>
              </div>
            </template>
            <template #[`item.placement`]="{ item }">
              <span class="boxed"> {{ item.placement }}% Placement </span>
            </template>
            <template #[`item.followers`]="{ item }">
              <span class="boxed"> {{ item.followers }} Followers </span>
            </template>
            <template #[`item.action`]="{ item }">
              <v-btn color="primary" @click.stop="follow(item)">Follow</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Filters from '@/components/Filters.vue'
export default {
  components: {
    Filters,
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Placement', value: 'placement' },
        { text: 'Followers', value: 'followers' },
        { text: 'Action', value: 'action', align: 'center' },
      ],
      playlists: [],
      loading: false,
      currentPage: 0,
      lastPage: 1,
    }
  },
  computed: {
    ...mapGetters({
      filters: 'filters/getFilters',
      cart: 'cart/getCart',
    }),
  },
  watch: {
    filters: {
      handler() {
        this.currentPage = 0
        this.getPlaylists()
      },
      deep: true,
    },
  },
  created() {
    this.getPlaylists()
  },
  methods: {
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
    ...mapMutations({
      ADD_TO_CART: 'cart/ADD_TO_CART',
      REMOVE_FROM_CART: 'cart/REMOVE_FROM_CART',
      RESET_FILTERS: 'filters/RESET_FILTERS',
    }),
    async getPlaylists() {
      this.currentPage = this.currentPage + 1
      this.loading = true
      const {
        data: { data },
      } = await this.$axios.get(
        `curator/playlist?page=${this.currentPage}${this.generateQueryString()}`
      )
      this.playlists = data
      this.loading = false
    },
    generateQueryString() {
      let queryString = ''
      for (const key in this.filters) {
        if (Array.isArray(this.filters[key]) && this.filters[key].length > 0) {
          if (key === 'followers') {
            queryString += `${key}Min=${this.filters[key][0]}&${key}Max=${this.filters[key][1]}&`
          } else if (key === 'price') {
            queryString += `${key}Min=${this.filters[key][0]}&${key}Max=${this.filters[key][1]}&`
          } else if (key === 'genres') {
            queryString += `${key}=${this.filters[key]}&`
          }
        } else if (this.filters[key] !== '' && this.filters[key] !== null) {
          queryString += `${key}=${this.filters[key]}&`
        }
      }
      queryString = queryString.substring(0, queryString.length - 1)
      return queryString ? `&${queryString}` : ''
    },
    onRowClick(item) {
      this.$router.push(`/playlist/${item.slug}`)
    },
    isInCart(id) {
      return this.cart.findIndex((v) => v.id === id) !== -1
    },
    onPage(page) {
      if (page.page === 1) {
        return
      }
      this.getPlaylists()
    },
    clearFilters() {
      this.RESET_FILTERS()
      this.$refs.filters.resetFilters()
    },
  },
}
</script>

<style lang="scss" scoped>
.name {
  > img,
  span {
    display: inline-block;
    vertical-align: middle;
  }
  > span {
    margin-left: 10px;
  }
  .small {
    color: rgba(255, 255, 255, 0.7);
  }
}
.boxed {
  font-size: 0.8rem;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 8px;
  text-align: center;
}
.row-pointer {
  ::v-deep .v-data-table__wrapper {
    > table > tbody > tr:hover {
      cursor: pointer;
    }
  }
}
</style>
