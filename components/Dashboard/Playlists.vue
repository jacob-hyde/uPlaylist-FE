<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="playlists"
      :loading="loading"
      :items-per-page="25"
    >
      <template #[`item.actions`]="{ item }">
        <v-btn v-if="!item.curator_playlist" color="primary" @click="openPricingDialog(item)">List Playlist</v-btn>
        <v-btn v-else color="primary" @click="openPricingDialog(item)">Edit (${{ item.price }})</v-btn>
        <v-btn v-if="item.curator_playlist" color="primary" @click="promotePlaylist(item)">Promote</v-btn>
        <v-btn v-if="item.curator_playlist" color="red" @click="removePlaylist(item)">Remove</v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="priceDialog" max-width="300">
      <v-card>
        <v-card-title>
          <span class="headline">Set Price</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="price"
            label="Price"
            type="number"
            min="1"
            step="0.1"
            :max="$auth.user.price"
            prepend-icon="mdi-currency-usd"
            required
          ></v-text-field>
          <v-select
            ref="select"
            v-model="genre_ids"
            :items="genres.map(g=>({value:g.id,text:g.name}))"
            :reduce="genre => genre.id"
            label="Genres"
            multiple
        ></v-select>
          <div class="text-right">
            <p>Fee: ${{price / 2}}</p>
          </div>
          <div class="text-center mt-4">
            <v-btn color="primary" @click="setPrice">Set Price</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <promote-playlist-modal :id="id" ref="promoteModal" />
  </div>
</template>

<script>
import PromotePlaylistModal from '@/components/Dashboard/PromotePlaylistModal.vue'
export default {
  components: {
    PromotePlaylistModal,
  },
  data() {
    return {
      playlists: [],
      loading: true,
      headers: [
        {
          text: 'Playlist Name',
          value: 'name',
          align: 'left',
        },
        {
          text: 'Track Count',
          value: 'track_count',
          align: 'center',
        },
        {
          text: 'Followers',
          value: 'followers',
          align: 'center',
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'right',
          width: '50%',
        },
      ],
      priceDialog: false,
      price: this.$auth.user.price,
      id: null,
      genre_ids: null,
      genres: [],
    }
  },
  watch: {
    priceDialog (val) {
      if (!val) {
        this.price = this.$auth.user.price
        this.genre_ids = null
      }
    },
  },
  created () {
    this.getPlaylists();
    this.getGenres();
  },
  methods: {
    async getPlaylists () {
      this.loading = true;
      try {
        const {data: {data}} = await this.$axios.get('spotify/playlists');
        this.playlists = data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
      this.loading = false;
    },
    async getGenres () {
      try {
        const {data: {data}} = await this.$axios.get('genre');
        this.genres = data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },
    openPricingDialog (playlist) {
      this.id = playlist.id;
      if (playlist.curator_playlist) {
        this.price = playlist.price;
        this.genre_ids = playlist.genres.map(g => g.id);
      }
      this.priceDialog = true;
    },
    promotePlaylist (playlist) {
      this.id = playlist.id;
      this.$refs.promoteModal.openModal();
    },
    async removePlaylist (playlist) {
      try {
        await this.$axios.delete(`curator/playlist/${playlist.id}`);
        this.getPlaylists();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    async setPrice () {
      try {
        await this.$axios.post('curator/playlist', {
          id: this.id,
          price: this.price,
          genres: this.genre_ids,
        })
        this.getPlaylists();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      this.priceDialog = false;
    }
  }
}
</script>

<style>

</style>
