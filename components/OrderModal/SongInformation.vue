<template>
  <div>
    <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.track_name"
        :rules="rules.track_name"
        label="Track Name"
        tabindex="0"
        required
      ></v-text-field>
      <v-text-field
        v-model="form.track_url"
        :rules="rules.track_url"
        label="Track URL"
        tabindex="0"
        required
        placeholder="https://open.spotify.com/track/53CJANUxooaqGOtdsBTh7O"
      ></v-text-field>
      <v-select
        v-model="form.genre_id"
        :items="
          genres.map((g) => {
            return { value: g.id, text: g.name }
          })
        "
        :rules="rules.genre_id"
        label="Genre"
        tabindex="0"
        required
      ></v-select>
    </v-form>
    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-btn text color="primary" name="next" @click="onSubmit">Next</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    track: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      form: {
        track_name: this.track ? this.track.name : '',
        track_url: this.track ? this.track.url : '',
        genre_id: null,
      },
      rules: {
        track_name: [(v) => !!v || 'Track name is required'],
        track_url: [
          (v) => !!v || 'Track Spotify URL is required',
          (v) => {
            if (v) {
              return (
                /^(https:\/\/open\.spotify\.com\/track\/)(.+)$/i.test(v) ||
                'Must be a valid spotify link'
              )
            }
            return true
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      genres: 'filters/getGenres',
    }),
  },
  created() {
    this.$emit('loading', false)
    if (this.genres.length === 0) {
      this.$store.dispatch('filters/getGenres')
    }
    if (this.track) {
      this.form.genre_id = this.genres.filter(
        (v) => v.name === this.track.genre
      )[0].id
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.$emit('loading', true)
      const formData = {
        name: this.form.track_name,
        url: this.form.track_url,
        genre_id: this.form.genre_id,
      }
      let url = 'curator/user-track'
      if (this.track !== null) {
        url += `/${this.track.uuid}`
        formData._method = 'PUT'
      }
      try {
        const {
          data: { data: track },
        } = await this.$axios.post(url, formData)
        track.genre_id = this.form.genre_id
        this.$emit('track-info', { ...track })
        this.$emit('next-step')
        this.$emit('loading', false)
      } catch (err) {
        this.throwError(err)
      }
      this.$emit('loading', false)
    },
  },
}
</script>
