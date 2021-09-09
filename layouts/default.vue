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
            <v-badge :content="cart.length" :value="cart.length" color="red" overlap>
              <v-btn color="primary" rounded @click="openOrderModal">
                <v-icon>mdi-cart</v-icon>
              </v-btn>
            </v-badge>
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
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <img src="/img/logo-dark.png" alt="uPlaylist Logo" height="56px"/>
        </v-col>
        <v-spacer></v-spacer>
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
