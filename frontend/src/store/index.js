import { createStore } from 'vuex'
import auth from './modules/auth'
import post from './modules/post'
import chat from './modules/chat'

export default createStore({
  modules: {
    auth,
    post,
    chat
  }
})
