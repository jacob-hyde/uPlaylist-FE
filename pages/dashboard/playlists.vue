<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-card-text class="text-center">
            <v-btn v-if="!spotify_connected" color="primary" @click="connectSpotify">
              <v-icon>mdi-spotify</v-icon>
              &nbsp;Connect Spotify
            </v-btn>
            <v-btn v-else color="primary" @click="updateSpotify">
              <v-icon>mdi-spotify</v-icon>
              &nbsp;Update Spotify
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-card-title>Playlists</v-card-title>
          <v-card-text>
            <playlists />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Playlists from "@/components/Dashboard/Playlists"
export default {
  components: {
    Playlists,
  },
  layout: 'dashboard',
  data () {
    return {
      spotify_connected: this.$auth.user.spotify_connected,
    }
  },
  async created () {
    if (this.$route.query.token_type && this.$route.query.code && process.browser) {
      try {
        await this.$axios.post('spotify', {code: this.$route.query.code});
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  },
  methods: {
    async connectSpotify () {
      try {
        const {data: {data: {url}}} = await this.$axios.get('spotify/connect-url');
        window.location.href = url;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },
    async updateSpotify () {
      try {
        await this.$axios.get('spotify/refresh');
        this.$router.replace({'query': null});
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
  }
}
</script>

<style>

</style>
