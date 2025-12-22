export default {
    namespaced: true,
    state: () => ({
      user: null,
      token: null
    }),
    mutations: {
      SET_USER(state, payload) {
        state.user = payload
      },
      SET_TOKEN(state, payload) {
        state.token = payload
      }
    }
  }
  