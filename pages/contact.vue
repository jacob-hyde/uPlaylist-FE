<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="headline">Contact</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
          <v-text-field
            v-model="form.first_name"
            label="First Name"
            :rules="[(v) => !!v || 'First Name is required']"
          ></v-text-field>
          <v-text-field
            v-model="form.last_name"
            label="Last Name"
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            label="Email"
            :rules="[
              (v) => !!v || 'Email is required',
              (v) => /.+@.+\..+/.test(v) || 'Email is invalid',
            ]"
          ></v-text-field>
          <v-select
            v-model="form.category_id"
            :items="categories.map((c) => ({ value: c.id, text: c.name }))"
            :reduce="(category) => category.id"
            label="Category"
          ></v-select>
          <v-text-field
            v-model="form.title"
            label="Title"
            :rules="[(v) => !!v || 'Title is required']"
          ></v-text-field>
          <v-textarea
            v-model="form.message"
            label="Message"
            :rules="[(v) => !!v || 'Message is required']"
          ></v-textarea>
          <div class="text-center">
            <v-btn type="submit" color="primary">Submit</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    try {
      const {
        data: { data: categories },
      } = await $axios.get(process.env.SUPPORT_API_URL + 'ticket/category')
      return { categories }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  },
  data() {
    return {
      valid: true,
      form: this.getForm(),
    }
  },
  methods: {
    getForm() {
      return {
        first_name: '',
        last_name: '',
        email: '',
        title: '',
        message: '',
        category_id: null,
      }
    },
    async onSubmit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      try {
        await this.$axios.post(
          process.env.SUPPORT_API_URL + 'ticket',
          this.form
        )
        this.$toast.success('Support Ticket Created!')
        this.form = this.getForm()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
  },
}
</script>

<style>
</style>
