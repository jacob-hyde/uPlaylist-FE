import createPersistedState from "vuex-persistedstate"

export default ({ store, req }) => {
  createPersistedState({
    paths: ["cart"],
  })(store)
}
