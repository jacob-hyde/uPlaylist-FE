<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card :loading="loading">
      <v-card-title>
        <span class="headline">Order</span>
      </v-card-title>
      <v-card-text>
        <features-terms-and-conditions
          v-if="step === 1"
          @next-step="onNextStep"
        ></features-terms-and-conditions>
        <user-info
          v-if="step === 2"
          @next-step="onNextStep"
          @loading="onLoadingChange"
        ></user-info>
        <song-information
          v-if="step === 3"
          @next-step="onNextStep"
          @loading="onLoadingChange"
          @track-info="setTrack"
        ></song-information>
        <checkout v-if="step === 4" :track="track"></checkout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FeaturesTermsAndConditions from './FeaturesTermsAndConditions.vue'
import UserInfo from './UserInfo.vue'
import SongInformation from './SongInformation.vue'
import Checkout from './Checkout.vue'
export default {
  components: {
    FeaturesTermsAndConditions,
    UserInfo,
    SongInformation,
    Checkout,
  },
  data() {
    return {
      dialog: false,
      step: 1,
      loading: false,
      track: null,
    }
  },
  methods: {
    openModal() {
      this.dialog = true
    },
    onLoadingChange(loading) {
      this.loading = loading
    },
    onNextStep() {
      this.step++
    },
    setTrack(track) {
      this.track = track
    },
  },
}
</script>

<style>
</style>
