<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-container>
        <v-row>
          <v-col cols="6" class="hidden-sm-and-down">
            <search />
          </v-col>
          <v-spacer></v-spacer>
          <v-col md="auto" class="py-0 d-flex align-center">
            <nuxt-link to="/" class="d-flex">
              <img src="/img/logo.png" alt="uPlaylist Logo" height="56px" class="mr-4" />
            </nuxt-link>
            <v-btn color="primary" link to="/register" class="mr-4 d-md-flex d-sm-none d-xs-none">Become a Curator</v-btn>
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
                        <v-list-item-subtitle> {{ item.price | centsToDollar }}</v-list-item-subtitle>
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
        </v-col>
      </v-row>
    </v-footer>
    <order-modal ref="orderModal" />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from "@/layouts/Header/Search.vue"
import OrderModal from "@/components/OrderModal/OrderModal.vue";

export default {
  components: {
    Search,
    OrderModal,
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
    openOrderModal() {
      if (this.cart.length === 0) {
        return
      }
      this.$refs.orderModal.openModal()
    }
  }
}
</script>
