import Vue from "vue"
import ValidationErrors from "@/components/ValidationErrors"

if (!Vue.__validation_mixin__) {
  Vue.__validation_mixin__ = true
  Vue.mixin({
    components: {
      ValidationErrors,
    },
    data () {
      return {
        validationErrors: [],
      }
    },
    methods: {
      formatErrors (items) {
        const errors = []
        ;(items || []).map((value) => {
          errors.push(value[0])
        })
        return errors
      },
    },
  })
}
