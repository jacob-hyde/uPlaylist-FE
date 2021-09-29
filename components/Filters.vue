<template>
  <div id="filters">
    <div class="form-group filter">
      <label for="search">Search</label>
      <v-text-field
        v-model="form.search"
        label="Playlist or username..."
        prepend-inner-icon="mdi-magnify"
        clearable
        outlined
      ></v-text-field>
    </div>
    <div class="form-group filter">
      <label for="followers">Followers</label>
      <v-range-slider v-model="form.followers" :min="100" :max="300000" dense />
      <p>
        <span class="float-left"
          ><span class="text-muted"></span>{{ form.followers[0] }}</span
        >
        <span class="float-right"
          ><span class="text-muted"></span>{{ form.followers[1] }}</span
        >
      </p>
    </div>
    <div class="form-group filter">
      <label for="genres">Genres</label>
      <v-checkbox
        v-for="genre in genres"
        :key="genre.id"
        v-model="form.genres"
        :label="genre.name"
        :value="genre.id"
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      form: {
        search: '',
        price: [1, 25],
        followers: [100, 3000000],
        genres: [],
      },
    }
  },
  computed: {
    ...mapGetters({
      genres: 'filters/getGenres',
    }),
  },
  watch: {
    form: {
      handler() {
        this.setFilters({ ...this.form })
      },
      deep: true,
    },
  },
  async created() {
    if (this.genres.length === 0) {
      await this.$store.dispatch('filters/getGenres')
    }
  },
  methods: {
    ...mapMutations({
      setFilters: 'filters/SET_FILTERS',
    }),
    resetFilters() {
      this.form = {
        search: '',
        price: [1, 25],
        followers: [100, 3000000],
        genres: [],
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#filters {
  .icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    &:hover,
    &.opened {
      color: #5e72e4;
    }
  }
  .money .text-muted:after {
    content: '$';
    color: rgba(255, 255, 255, 0.7);
  }
  span {
    font-size: 11px;
  }
}
.form-group {
  margin-bottom: 30px;
  .v-input {
    ::v-deep .v-messages {
      display: none;
    }
    ::v-deep .v-input__slot {
      margin: 0;
    }
    ::v-deep .v-text-field__details {
      display: none;
    }
  }
}
label {
  display: block;
  color: #fff;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>
