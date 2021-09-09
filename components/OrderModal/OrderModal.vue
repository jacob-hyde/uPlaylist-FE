<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>
        <span class="headline">Order</span>
      </v-card-title>
      <v-card-text>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
    }
  },
  methods: {
    openModal () {
      this.dialog = true
    },
  }
}
</script>

<style>

</style>
