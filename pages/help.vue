<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel v-for="article in helpArticles" :key="article.id">
        <v-expansion-panel-header>{{
          article.question
        }}</v-expansion-panel-header>
        <v-expansion-panel-content
          class="flex-column"
          style="padding: 16px 24px"
          v-html="article.answer"
        ></v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const {
      data: { data: helpArticles },
    } = await $axios.get('help')
    return { helpArticles }
  },
}
</script>

<style>
</style>
