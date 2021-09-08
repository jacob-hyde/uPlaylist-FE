<template>
  <v-autocomplete
    v-model="select"
    :loading="loading"
    :items="items"
    :filter="(v) => v"
    :search-input.sync="search"
    prepend-inner-icon="mdi-magnify"
    :append-icon="null"
    flat
    hide-no-data
    hide-details
    solo-inverted
    placeholder="Search..."
    outlined
    dense
  >
    <template #item="{ item }">
        <v-list-item
          class="cursor-pointer"
          @click="showItem(item.type.raw, item.id.raw)"
        >
          <v-list-item-avatar class="square">
            <v-img
              :src="item.img_url"
              :alt="item.name"
              :title="item.name"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span class="d-block subtitle-1 search-item-title">{{
                item.name
              }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
  </v-autocomplete>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      select: null,
      items: [],
      search: null,
    }
  },
  watch: {
    search (val) {
      val && val !== this.searchQuery && this.doSearch(val)
    },
  },
  methods: {
    async doSearch (val) {
      this.loading = true;
      const {data: {data}} = await this.$axios.get(`curator/playlist/search?search=${val}`)
      this.items = data;
      this.loading = false;
    },
  }
}
</script>

<style>

</style>
