<script>
import api from '@/services/api';

  export default {
    name: 'Chat',
    data() {
      return {
        id:null,
        userId:null,
        message: '',
        isFocused: false,
        user: null,
        backClicked: false
      }
    },
    computed: {
      showSend() {
        return this.isFocused || this.message.length > 0
      },
    },
    methods: {
      sendMessage() {
        if (!this.message.trim()) return
        console.log('Sending:', this.message)
        this.message = ''
      },
      goBack() {
    this.backClicked = true

    // small delay so icon change is visible
    setTimeout(() => {
      this.$router.back()
    }, 1000)
  },
      async fetchUserChat(){
        try{
          let res = await api.get(`/find-user-chat/${this.$route.params.id}`)
          this.user = res.data.user
          console.log(res.data.success)
        }catch(e){
          console.log(e)
          return console.log()
        }
      }
    },
    mounted(){
      this.fetchUserChat()
    }
  }
  </script>
<template>
  <div class="chat-page">

    <!-- 🔥 CHAT HEADER -->
    <div class="chat-header" v-if="user">
      <!-- <i class="bi bi-arrow-left" @click="goBack"></i> -->
      <!-- <router-link :to="this.router.back()" > -->
        <font-awesome-icon
  :icon="backClicked ? ['fas','angles-left'] : ['fas','angle-left']"
  class="angle"
  size="lg"
  @click="goBack"
/>

      <!-- </router-link> -->

      <img :src="user.avatar" class="avatar" />

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

.angle{
  color: rgb(255, 222, 179);
  cursor: pointer;
}
.angle {
  transition:color .7 ease , transform .5 ease-in-out;
}

.angle:active {
  color: rgb(96, 54, 0);
  transform: scale(0.9);
}


.chat-header .avatar {
  width: 36px;
  height: 36px;
  object-fit: cover;
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