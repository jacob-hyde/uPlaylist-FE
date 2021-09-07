<template>
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="11" lg="5">
        <v-card :loading="loading">
          <v-card-title class="justify-center">
            <h2>Register</h2>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
              <validation-errors :errors="validationErrors" />
              <v-text-field
                v-model="form.first_name"
                label="First Name"
                :rules="[v => !!v || 'First Name is required']"
              ></v-text-field>
              <v-text-field
                v-model="form.last_name"
                label="Last Name"
                :rules="[v => !!v || 'Last Name is required']"
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email"
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email is invalid']"
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                label="Password"
                :rules="[v => !!v || 'Password is required']"
                type="password"
              ></v-text-field>
              <v-text-field
                v-model="form.password_confirmation"
                label="Password Confirmation"
                :rules="[v => !!v || 'Password Confirmation is required', v => v === form.password || 'Password Confirmation must match Password']"
                type="password"
              ></v-text-field>
              <div class="text-center mt-4">
                <v-btn type="submit" color="primary">Register</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      valid: true,
      loading: false,
      form: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      try {
        const {data: {data}} = await this.$axios.post('auth/register', this.form)
        await this.$auth.setUserToken(data.access_token)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        let items
        if (error.response && error.response.status === 400) {
          items = Object.values(error.response.data.data.message)
        } else if (error.response && error.response.status === 422) {
          items = Object.values(error.response.data.errors)
          // eslint-disable-next-line no-console
          console.error(items)
        }
        this.validationErrors = this.formatErrors(items)
      }
      this.loading = false
    }
  }
}
</script>

<style>

</style>
