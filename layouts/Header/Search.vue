<template>
  <v-autocomplete
    v-model="select"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    prepend-inner-icon="mdi-magnify"
    :append-icon="null"
    cache-items
    flat
    hide-no-data
    hide-details
    solo-inverted
  ></v-autocomplete>
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
}
</script>

<style>

</style>
