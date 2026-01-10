// store/modules/chat.js
import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    activeChat: null, // This will hold the object you pasted
  },
  mutations: {
    SET_ACTIVE_CHAT(state, chat) {
      state.activeChat = chat;
    }
  },
  actions: {
    // Optional: Action to fetch chat if it's missing (e.g., on page refresh)
    async fetchChatById({ commit }, chatId) {
      try {
        const res = await api.get(`/chat/${chatId}`); // Adjust your endpoint API
        commit('SET_ACTIVE_CHAT', res.data.chat);
      } catch (error) {
        console.error("Failed to fetch chat", error);
      }
    },
    async fetchChatByUser({commit}, userId){
        const res = await api.post(`/chat/user/${userId}`)
        console.log(res.data.chat)
        commit('SET_ACTIVE_CHAT',res.data.chat)
    }
  },
  getters: {
    activeChat: state => state.activeChat,
    activeChatId : state => state.activeChat?._id
  }
};