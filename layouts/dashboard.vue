<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app>
      <div class="text-center mt-4">
        <h2 class="h2">Dashboard</h2>
      </div>
      <v-list nav>
        <v-list-item link to="/dashboard/orders">
          <v-list-item-icon>
            <v-icon color="primary">mdi-clipboard-play</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/dashboard/playlists">
          <v-list-item-icon>
            <v-icon color="primary">mdi-spotify</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Playlists</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/dashboard/payout">
          <v-list-item-icon>
            <v-icon color="primary">mdi-bank</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Payout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/dashboard/account">
          <v-list-item-icon>
            <v-icon color="primary">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/dashboard/pro">
          <v-list-item-icon>
            <v-icon color="primary">mdi-check-decagram</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Pro</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-container>
        <v-row>
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-spacer></v-spacer>
          <v-col md="auto" class="py-0 d-flex align-center">
            <nuxt-link to="/" class="d-flex">
              <img
                src="/img/logo.png"
                alt="uPlaylist Logo"
                height="56px"
                class="mr-4"
              />
            </nuxt-link>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <v-row>
        <v-col cols="12" class="text-center pb-0">
          <img src="/img/logo-dark.png" alt="uPlaylist Logo" height="56px" />
        </v-col>
        <v-col cols="12" class="text-center pt-0">
          <a href="#" @click.prevent="logout">Logout</a>
          |
          <nuxt-link to="/curator-help">Help</nuxt-link>
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
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      this.$router.push('/')
    },
  },
}
</script>
