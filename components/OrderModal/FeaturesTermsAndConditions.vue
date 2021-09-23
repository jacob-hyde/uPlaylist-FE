<template>
  <div>
    <div class="text-center curatorterms">
      <!-- <picture>
        <source srcset="/img/curator/curator_sm.webp" type="image/webp" />
        <img
          src="/img/curator/curator_sm.png"
          alt="disc in sleeve"
          title="disc in sleeve"
          loading="lazy"
        />
      </picture> -->
    </div>
    <dl class="text-center curatorterms-list">
      <dt>
        The *opportunity to get on industry leading playlists is here.<br />Submit
        your music to verified curators!
      </dt>
      <dd>
        Please allow 1 - 4 business days for your selected Curator to review
        each of your submissions to their playlists. If your submission is
        approved, each Curator may take up to 7 days to add your submission to
        their playlist.
      </dd>
      <dd>
        <span
          >*Placement percentage DOES NOT guarantee your song will be placed,
          but a higher percentage increases your chance. Placement is NOT
          guaranteed and is decided solely by the playlist owner. NO
          REFUNDS.</span
        >
      </dd>
    </dl>
    <div class="curatorterms-section text-center">
      <v-checkbox
        id="agree-terms"
        v-model="agreeStatus"
        name="agree-terms"
        class="curatorterms-agree"
      >
        <template #label>
          <strong>
            I agree to the&nbsp;<a :href="termConditionsUrl" target="_blank"
              >Terms & Conditions</a
            >
          </strong>
        </template>
      </v-checkbox>
      <v-btn
        dark
        color="primary"
        class="curatorterms-button"
        name="continue"
        @click="onContinue"
      >
        Continue
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      agreeStatus: false,
      termConditionsUrl:
        'https://uplaylist-static.s3.us-east-2.amazonaws.com/terms-conditions.pdf',
    }
  },
  methods: {
    onContinue() {
      if (this.agreeStatus) {
        this.$emit('next-step')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.curatorterms {
  &-list {
    max-width: 80%;
    margin: 30px auto;
    dt {
      text-transform: uppercase;
    }
    dl {
      margin-top: 15px;
      text-align: center;
      list-style: none;
      margin-left: -5%;
    }
    dd {
      margin: 10px 0;
      span {
        font-size: 0.6rem;
      }
    }
  }
  &-section {
    width: max-content;
    margin: 0 auto;
  }
  &-button {
    margin-top: 15px;
  }
}
</style>
