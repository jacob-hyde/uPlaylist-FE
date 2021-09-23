<template>
  <div>
    <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.first_name"
        label="First Name"
        :rules="[(v) => !!v || 'First Name is required']"
        required
      ></v-text-field>
      <v-text-field
        v-model="form.last_name"
        label="Last Name"
        :rules="[(v) => !!v || 'Last Name is required']"
        required
      ></v-text-field>
      <v-text-field
        v-model="form.email"
        label="Email"
        :rules="[
          (v) => !!v || 'Email is required',
          (v) => /.+@.+\..+/.test(v) || 'Email is invalid',
        ]"
        required
      ></v-text-field>
      <VuePhoneNumberInput v-model="form.phone" dark class="mt-4" />
      <div class="text-center mt-4">
        <v-btn color="primary" type="submit">Next</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      form: {
        first_name: null,
        last_name: null,
        email: null,
        phone: null,
      },
    }
  },
  created() {
    if (this.$auth.loggedIn) {
      this.$emit('next-step')
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.$emit('loading', true)
      try {
        const {
          data: { data },
        } = await this.$axios.post('curator/order/register', this.form)
        await this.$auth.setUserToken(data.token)
        await this.$auth.fetchUser()
        this.$emit('loading', false)
        this.$emit('next-step')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
      this.$emit('loading', false)
    },
  },
}
</script>

<style>
</style>
