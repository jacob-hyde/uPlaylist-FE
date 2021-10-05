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
            :items-per-page="15"
            :options.sync="options"
            :server-items-length="totalPlaylists"
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
                  <span class="small">{{ item.username }}</span>
                  <br />
                  <span class="small"
                    >Genres:
                    {{
                      item.genres.map((genre) => genre.name).join(', ')
                    }}</span
                  >
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
              <v-btn
                v-if="!isInCart(item.id)"
                color="primary"
                @click.stop="ADD_TO_CART(item)"
              >
                <v-icon> mdi-cart </v-icon>
                &nbsp;{{ item.price | centsToDollar }}
              </v-btn>
              <v-btn v-else color="red" @click.stop="REMOVE_FROM_CART(item)"
                >Remove</v-btn
              >
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
        {
          text: 'Placement',
          value: 'placement',
          width: '20%',
          sortable: false,
        },
        { text: 'Followers', value: 'followers', width: '20%' },
        { text: 'Action', value: 'action', align: 'center', sortable: false },
      ],
      playlists: [],
      loading: false,
      currentPage: 0,
      options: {},
      totalPlaylists: 0,
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
        this.options.page = 0
        this.getPlaylists()
      },
      deep: true,
    },
    options: {
      handler() {
        this.getPlaylists()
      },
      deep: true,
    },
  },
  created() {
    this.getPlaylists()
  },
  methods: {
    ...mapMutations({
      ADD_TO_CART: 'cart/ADD_TO_CART',
      REMOVE_FROM_CART: 'cart/REMOVE_FROM_CART',
      RESET_FILTERS: 'filters/RESET_FILTERS',
    }),
    async getPlaylists() {
      this.loading = true
      const {
        data: { data },
      } = await this.$axios.get(
        `curator/playlist?${this.generateQueryString()}`
      )
      this.playlists = data.playlists
      this.totalPlaylists = data.items_count
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
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      if (sortBy) {
        queryString += `sortBy=${sortBy}&sortDesc=${sortDesc}&`
      }
      if (page) {
        queryString += `page=${page}&`
      } else {
        queryString += `page=1&`
      }
      if (itemsPerPage) {
        queryString += `itemsPerPage=${itemsPerPage}&`
      } else {
        queryString += `itemsPerPage=25&`
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
  display: flex;
  align-items: center;
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
.v-btn {
  min-width: 130px !important;
}
</style>
