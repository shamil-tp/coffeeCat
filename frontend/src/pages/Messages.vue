<script>
  export default {
    name: 'Messages',
    data() {
      return {
        users: [
          { id: 1, name: 'jason', lastMessage: 'Did you eat?', time: '2m' },
          { id: 2, name: 'Arjun', lastMessage: 'Project ready?', time: '10m' },
          { id: 3, name: 'Rahul', lastMessage: 'Call me', time: '1h' },
          { id: 4, name: 'Sneha', lastMessage: '😂😂', time: '3h' }
        ]
      }
    },
    methods: {
      openChat(user) {
        this.$router.push(`/chat/${user.id}`)
      }
    }
  }
  </script>
  
  <template>
    <div class="messages__container">
      <h2 class="messages__title">Messages</h2>
  
      <div
        v-for="user in users"
        :key="user.id"
        class="message__card"
        @click="openChat(user)"
      >
        <div class="avatar">
          {{ user.name.charAt(0) }}
        </div>
  
        <div class="message__info">
          <p class="username">{{ user.name }}</p>
          <p class="last__message">{{ user.lastMessage }}</p>
        </div>
  
        <div class="time">{{ user.time }}</div>
      </div>
    </div>
  </template>
  
      <style scoped>
        .messages__container {
  min-height: 100vh;
  background-color: rgb(32, 17, 6);
  padding: 1rem;
  padding-bottom: 90px; /* space for bottom nav */
}

.messages__title {
  color: rgb(255, 222, 179);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* Message card */
.message__card {
  display: flex;
  align-items: center;
  background-color: rgb(51, 34, 28);
  padding: 0.8rem;
  border-radius: 14px;
  margin-bottom: 0.7rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.message__card:hover {
  background-color: rgb(92, 63, 53);
  transform: scale(1.02);
}

/* Avatar */
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ffb78e;
  color: rgb(51, 34, 28);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 0.8rem;
}

/* Info */
.message__info {
  flex: 1;
}

.username {
  color: rgb(255, 222, 179);
  font-weight: 600;
  margin: 0;
}

.last__message {
  color: #ffb78e;
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
}

/* Time */
.time {
  font-size: 0.75rem;
  color: rgb(255, 222, 179);
  opacity: 0.7;
}

      </style>