<template>
  <div>
    <v-alert v-if="errorCount" type="error">
      <ul>
        <li v-for="(error, index) in errors" :key="index">
          {{ error }}
        </li>
      </ul>
    </v-alert>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    errorCount () {
      return !!this.$props.errors.length
    },
  },
  methods: {
    key (index) {
      return `validation_error_${index}_${Math.random()}`
    },
  },
}
</script>

<style scoped>
ul {
  padding: 0 0 0 10px;
  margin: 0;
  font-size: 16px;
}
ul li {
  list-style: none;
}
</style>
