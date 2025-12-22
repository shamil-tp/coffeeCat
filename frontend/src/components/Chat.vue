<script>
  export default {
    name: 'Chat',
    data() {
      return {
        message: '',
        isFocused: false,
        user: {
          name: 'Jason',
          username: 'jason_dev'
        }
      }
    },
    computed: {
      showSend() {
        return this.isFocused || this.message.length > 0
      },
      avatarUrl() {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.user.username}`
      }
    },
    methods: {
      sendMessage() {
        if (!this.message.trim()) return
        console.log('Sending:', this.message)
        this.message = ''
      },
      goBack() {
        this.$router.back()
      }
    }
  }
  </script>
<template>
  <div class="chat-page">

    <!-- 🔥 CHAT HEADER -->
    <div class="chat-header">
      <i class="bi bi-arrow-left" @click="goBack"></i>

      <img :src="avatarUrl" class="avatar" />

      <p class="name">{{ user.name }}</p>
    </div>

    <!-- CHAT BODY -->
    <div class="chat-body">
      <div class="bubble received">Hey 👋</div>
      <div class="bubble sent">Hi! How are you?</div>
      <div class="bubble received">Did you eat?</div>
    </div>

    <!-- INPUT BAR -->
    <div class="chat-input">
      <input
        type="text"
        placeholder="Message..."
        v-model="message"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keyup.enter="sendMessage"
      />

      <i v-if="!showSend" class="bi bi-image"></i>
      <i v-else class="bi bi-send-fill send" @click="sendMessage"></i>
    </div>

  </div>
</template>

<style scoped>
/* PAGE */
.chat-page {
  height: 100vh;
  background: rgb(32, 17, 6);
  display: flex;
  flex-direction: column;
}

/* HEADER */
.chat-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  gap: 0.7rem;

  padding: 0.7rem 1rem;
  background: rgb(32, 17, 6);
  border-bottom: 1px solid rgb(51, 34, 28);
  z-index: 10;
}

.chat-header i {
  font-size: 1.6rem;
  color: rgb(255, 222, 179);
  cursor: pointer;
}

.chat-header .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.chat-header .name {
  color: rgb(255, 222, 179);
  font-weight: 600;
  margin: 0;
}

/* BODY */
.chat-body {
  flex: 1;
  padding: 1rem;
  margin-top: 60px;    /* ⬅ space for header */
  margin-bottom: 90px; /* ⬅ space for input */
  overflow-y: auto;
}

/* BUBBLES */
.bubble {
  max-width: 70%;
  padding: 0.6rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
}

.sent {
  background: #ffb78e;
  color: rgb(51, 34, 28);
  margin-left: auto;
  border-bottom-right-radius: 6px;
}

.received {
  background: rgb(51, 34, 28);
  color: rgb(255, 222, 179);
  border-bottom-left-radius: 6px;
}

/* INPUT BAR */
.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.6rem 0.8rem;
  background: rgb(32, 17, 6);
  border-top: 1px solid rgb(51, 34, 28);
}

/* INPUT */
.chat-input input {
  flex: 1;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: none;
  outline: none;

  background: rgb(51, 34, 28);
  color: rgb(255, 222, 179);
  font-size: 0.9rem;
}

.chat-input input::placeholder {
  color: #ffb78e;
  opacity: 0.7;
}

/* ICONS */
.chat-input i {
  font-size: 1.3rem;
  color: #ffb78e;
  cursor: pointer;
}

.chat-input .send {
  transform: rotate(45deg);
}


</style>  