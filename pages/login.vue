<template>
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="11" lg="5">
        <v-card :loading="loading">
          <v-card-title class="justify-center">
            <h2>Login</h2>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
              <validation-errors :errors="validationErrors" />
              <v-text-field
                v-model="form.email"
                label="Email"
                :rules="[(v) => !!v || 'Email is required']"
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                :rules="[(v) => !!v || 'Password is required']"
              ></v-text-field>
              <div class="text-center mt-4">
                <v-btn type="submit" color="primary">Login</v-btn>
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
  data() {
    return {
      valid: true,
      loading: false,
      form: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      try {
        await this.$auth.loginWith('local', {
          data: this.form,
        })
        this.$router.push('/dashboard/playlists')
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
    },
  },
}
</script>

<style>
</style>
