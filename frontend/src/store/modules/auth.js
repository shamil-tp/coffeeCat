import api from "@/services/api";

export default{
  namespaced:true,
  state(){
    return{
      user:null,
      token:null,
    }
  },
  getters:{
    userDetails(state){
      return state.user
    },
    isLoggedIn(state){
      return !!state.token
    }
  },
  mutations:{
    SET_USER(state,payload){
      state.user = payload
    },
    SET_TOKEN(state,payload){
      state.token = payload
    },
    CLEAR_USER(state){
      state.token = null
      state.user = null
    }
  },
  actions:{
    async fetchUser({commit}){
      try{
        const res = await api.get('/profile')
        commit('SET_USER',res.data.user)
        commit('SET_TOKEN',res.data.token)
      }catch(e){
        commit('CLEAR_USER')
      }
    },
    async logout({commit}){
      try{
        const res = await api.get('/logout')
        commit('CLEAR_USER')
      }catch(e){
        console.log(e)
        commit('CLEAR_USER')
      }
    }
  }
}



// export default {
//     namespaced: true,
//     state: () => ({
//       user: null,
//       token: null
//     }),
//     mutations: {
//       SET_USER(state, payload) {
//         state.user = payload
//       },
//       SET_TOKEN(state, payload) {
//         state.token = payload
//       }
//     }
//   }
  