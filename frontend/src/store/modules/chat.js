export default {
    namespaced: true,
  
    state: () => ({
      chats: [
        {
          id: 1,
          user: {
            name: "Dheema",
            avatar: "https://i.pravatar.cc/150?img=12",
            online: true,
            lastSeen: "10:30 AM"
          },
          messages: [
            { text: "Hey ☕🐱", time: "10:40", me: false },
            { text: "Coffee Cat is cute!", time: "10:41", me: true }
          ]
        },
        {
          id: 2,
          user: {
            name: "Arjun",
            avatar: "https://i.pravatar.cc/150?img=32",
            online: false,
            lastSeen: "Yesterday"
          },
          messages: [
            { text: "You free today?", time: "9:00", me: false }
          ]
        }
      ],
      activeChatId: null
    }),
  
    mutations: {
      SET_ACTIVE_CHAT(state, chatId) {
        state.activeChatId = chatId
      }
    },
  
    getters: {
      activeChat(state) {
        return state.chats.find(c => c.id === state.activeChatId)
      }
    }
  }
  