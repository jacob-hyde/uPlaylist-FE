<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card :loading="loading">
          <v-card-title>
            <span class="headline">Account</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
              <v-text-field
                v-model="form.first_name"
                label="First Name"
                :rules="[v => !!v || 'First Name is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.last_name"
                label="Last Name"
                :rules="[v => !!v || 'Last Name is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.username"
                label="Username"
                :rules="[v => !!v || 'Username is required', () => usernameAvailable || 'Username is not available']"
                required
                @keyup="onUsernameKeyup"
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email"
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email is invalid']"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                label="Password"
              ></v-text-field>
              <v-text-field
                v-model="form.password_confirmation"
                label="Password Confirmation"
                :rules="[v => v === form.password || 'Password Confirmation must match Password']"
              ></v-text-field>
              <v-text-field
                v-model="form.paypal_email"
                label="Paypal Email"
                :rules="[v => !!v || 'Paypal Email is required', v => /.+@.+\..+/.test(v) || 'Paypal Email is invalid']"
                required
              ></v-text-field>
              <div class="text-center mt-4">
                <v-btn type="submit" color="primary" :disabled="!valid">Save</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'lodash';
export default {
  layout: 'dashboard',
  middleware: 'auth',
  data () {
    return {
      valid: true,
      loading: false,
      usernameAvailable: true,
      form: {
        first_name: this.$auth.user.first_name,
        last_name: this.$auth.user.last_name,
        username: this.$auth.user.username,
        email: this.$auth.user.email,
        password: null,
        password_confirmation: null,
        paypal_email: this.$auth.user.paypal_email
      }
    }
  },
  methods: {
    onUsernameKeyup: _.debounce(async function() {
      const { data: { data } } = await this.$axios.post(`auth/username-available`, { username: this.form.username });
      this.usernameAvailable = data ? data.available : false;
      this.$refs.form.validate();
    }, 400),
    async onSubmit () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      try {
        const {data: {data}} = await this.$axios.put('auth', this.form);
        this.$auth.updateUser(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      this.loading = false;
    },
  }
}
</script>

<style>

</style>
