<script>
import api from '@/services/api';
import { mapActions, mapGetters } from 'vuex';
import socket from '@/services/socket';
import MessageBubble from '@/components/MessageBubble.vue';
import ViewProfile from './ViewProfile.vue';

  export default {
    components: {MessageBubble},
    name: 'Chat',
    data() {
      return {
        // id:null,
        userId:null,
        message: '',
        messages:[],
        isFocused: false,
        // user: null,
        backClicked: false,
        peopleCount:0,
        // reciver:null,
      }
    },
    computed: {
      ...mapGetters('chat',{
        chat:'activeChat'
      }),
      ...mapGetters('auth',{
        currentUser:'userDetails'
      }),
      showSend() {
        return this.isFocused || this.message.length > 0
      },
      receiver(){
        if (!this.chat || !this.currentUser) return null;
        return this.chat.members.find(member => member._id !== this.currentUser._id)
      },
    },
    methods: {
      goToViewProfile(){
        this.$router.push(`/view-profile/${this.receiver._id}`)
      },
      ...mapActions('chat', ['fetchChatById']),
      sendMessage() {
        if (!this.message.trim()) return
        const messageData = {
        _id: Date.now(), // Temporary ID until DB saves it
        text: this.message,
        sender: this.currentUser,
        chatId: this.chat._id,
        createdAt: new Date().toISOString()
      };
      // 3. Emit to Server
      socket.emit("new_message", messageData);

      // 4. Update UI immediately (Optimistic UI)
      this.messages.push(messageData);
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
          
        }catch(e){
          console.log(e)
          return console.log()
        }
      }
    },

async created() {
    // ... (keep your existing fetch logic) ...
    const routeId = this.$route.params.id;

    // If chat isn't in Vuex, fetch it
    if (!this.chat || this.chat._id !== routeId) {
       await this.fetchChatById(routeId);
    }
    
    try {
      const { data } = await api.get(`/messages/${routeId}`);
      this.messages = data; // Fill the array with history
    } catch (error) {
      console.log("Failed to load messages", error);
    }

    // Now you can log it (use 'this.')
    console.log("Receiver:", this.receiver); 
    // 2. Connect to the WebSocket
    socket.connect();
    socket.emit("join_chat", this.chat._id,this.receiver._id);

    // 6. Listen for incoming messages
    socket.on("message_received", (newMessage) => {
      console.log("Message received:", newMessage);
      this.messages.push(newMessage);
    });

    //    USER COUNT TO CHECK IF USER ONLINE AND MESSAGE SEEN
    
    socket.on("people_count",(count)=>{
      this.peopleCount = count
    })
    
    socket.on("messages_read", () => {
      console.log("Messages were read by user");
      // Loop through messages and mark my own unread messages as seen locally
      this.messages.forEach(msg => {
        if (msg.sender._id === this.currentUser._id) {
            msg.seen = true;
        }
      });
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected! ID:", socket.id);
    });
  },

  beforeUnmount() {
    // 3. Disconnect when leaving the page to save resources
    console.log("❌ Disconnecting Socket...");
    socket.disconnect();
    // Also remove listeners to prevent memory leaks
    socket.off("connect");

    socket.off("message_received"); // Stop listening
    // socket.disconnect();
  }








    // mounted(){
    //   this.fetchUserChat()
    //   this.reciver = this.setReceiver()
    // }
  }
  </script>
<template>
  <div class="chat-page">

    <!-- 🔥 CHAT HEADER -->
    <div class="chat-header" v-if="receiver">
      <!-- <i class="bi bi-arrow-left" @click="goBack"></i> -->
      <!-- <router-link :to="this.router.back()" > -->
        <font-awesome-icon
  :icon="backClicked ? ['fas','angles-left'] : ['fas','angle-left']"
  class="angle"
  size="xl"
  @click="goBack"
/>

      <!-- </router-link> -->
      <img :src="receiver.avatar" class="avatar" @click="goToViewProfile"/>

      <!-- <p class="name">{{ receiver.name }}</p> -->
       <div class="header-info">
    <p class="name">{{ receiver.name }}</p>
    
    <p class="status">
       <span v-if="peopleCount > 1" class="online-text">
         <span class="dot"></span> Online
       </span>
       <span v-else class="offline-text">Offline</span>
    </p>
  </div>
    </div>

    <!-- CHAT BODY -->
    <div class="chat-body">
  <MessageBubble 
        v-for="msg in messages" 
        :key="msg._id" 
        :msg="msg" 
        :peopleCount="peopleCount"
        :currentUser="currentUser"
      />
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

      <!-- <i v-if="!showSend" class="bi bi-image"></i> -->
      <font-awesome-icon v-if="!showSend" size="xl" icon="fa-regular fa-image" class="spinning" />
      <!-- <i v-else class="bi bi-send-fill send" @click="sendMessage"></i> -->
      <font-awesome-icon :icon="['fas','paper-plane']"   rotateBy
  style="--fa-rotate-angle: 45deg" size="lg" v-else  class="spinning" @click="sendMessage "/>

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

.header-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.status {
  margin: 0;
  font-size: 0.75rem;
}

.online-text {
  color: #4cd137; /* Green */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.offline-text {
  color: rgba(255, 222, 179, 0.5);
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #4cd137;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 5px #4cd137;
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
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
}

.chat-input input::placeholder {
  color: #ffb78e;
  font-family: monospace;
  font-weight: 600;
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

.spinning{
  color: #ffb78e;
}

</style>  