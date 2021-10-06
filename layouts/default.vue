<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click.stop="filtersDrawer = !filtersDrawer"></v-app-bar-nav-icon>
      <v-container>
        <v-row>
          <v-col cols="6" class="hidden-sm-and-down">
            <search />
          </v-col>
          <v-spacer></v-spacer>
          <v-col sm="6" class="py-0 d-flex align-center justify-sm-center justify-xs-center">
            <nuxt-link to="/" class="d-flex">
              <img src="/img/logo.png" alt="uPlaylist Logo" height="56px" class="mr-4" />
            </nuxt-link>
            <v-btn v-if="$auth.loggedIn && $auth.user && $auth.user.is_curator" color="primary" link to="/dashboard/orders" class="mr-4 d-md-flex d-none d-md-flex">Dashboard</v-btn>
            <v-btn v-else color="primary" link to="/register" class="mr-4 d-md-flex d-none d-md-flex">Become a Curator</v-btn>
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-badge :content="cart.length" :value="cart.length" color="red" overlap>
                  <v-btn
                    dark
                    v-bind="attrs"
                    color="primary"
                    rounded
                    v-on="on"
                  >
                    <v-icon>mdi-cart</v-icon>
                  </v-btn>
                </v-badge>
              </template>
              <v-card>
                <v-card-text>
                  <v-list three-line>
                    <v-list-item
                      v-for="(item, index) in cart"
                      :key="index"
                    >
                      <v-list-item-avatar>
                        <v-img :src="item.img_url"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.price | centsToDollar }} - <a href="#" @click.prevent="REMOVE_FROM_CART(item)">Remove</a>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Total: {{ total | centsToDollar }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-actions>
                        <v-btn
                          dark
                          color="primary"
                          rounded
                          @click="openOrderModal"
                        >
                          Checkout&nbsp;<v-icon>mdi-cart</v-icon>
                        </v-btn>
                      </v-list-item-actions>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>
          <v-spacer class="hidden-md-and-up"></v-spacer>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer>
      <v-row>
        <v-col cols="12" class="text-center pb-0">
          <img src="/img/logo-dark.png" alt="uPlaylist Logo" height="56px"/>
        </v-col>
        <v-col cols="12" class="text-center pt-0">
          <nuxt-link to="/login">Login</nuxt-link>
          |
          <nuxt-link to="/help">Help</nuxt-link>
          |
          <a
            href="https://app.termly.io/document/privacy-policy/da5b475c-2858-4d7f-8310-57130372a10d"
            >Privacy</a
          >
          |
          <a
            href="https://app.termly.io/document/disclaimer/9fb7b34e-9d3d-4c75-8e61-f842f9ce01cb"
            >Dislaimer</a
          >
          |
          <a href="mailto:support@uplaylist.com">Contact</a>
        </v-col>
      </v-row>
    </v-footer>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="filtersDrawer"
      width="300"
      fixed
      temporary
    >
      <v-card>
          <v-card-title class="d-flex justify-space-between mb-1">
            <span>Filters</span>
            <v-btn text color="primary" @click="clearFilters">Clear filters</v-btn>
          </v-card-title>
          <v-card-text>
            <filters ref="filters" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-navigation-drawer>
    <order-modal ref="orderModal" />
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Search from '@/layouts/Header/Search.vue'
import Filters from '@/components/Filters.vue'
import OrderModal from '@/components/OrderModal/OrderModal.vue'

export default {
  components: {
    Search,
    Filters,
    OrderModal,
  },
  data() {
    return {
      filtersDrawer: false,
    }
  },
  computed: {
    ...mapGetters({
      cart: 'cart/getCart',
    }),
    total() {
      return this.cart.reduce((accum, val) => {
        accum += val.price
        return accum
      }, 0)
    },
  },
  methods: {
    ...mapMutations({
      RESET_FILTERS: 'filters/RESET_FILTERS',
      REMOVE_FROM_CART: 'cart/REMOVE_FROM_CART',
    }),
    openOrderModal() {
      if (this.cart.length === 0) {
        return
      }
      this.$refs.orderModal.openModal()
    },
    clearFilters() {
      this.RESET_FILTERS()
      this.$refs.filters.resetFilters()
    },
  },
}
</script>
