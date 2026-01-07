<script>
import api from '@/services/api';
import { mapGetters } from 'vuex';
import SearchUser from '@/components/SearchUser.vue'; // 👈 IMPORT THE COMPONENT

export default {
  name: 'Messages',
  components: {
    SearchUser // 👈 REGISTER THE COMPONENT
  },
  data() {
    return {
      users: null,
      showAdd: null,
      plusAnimation:null,
    }
  },
  methods: {
    openChat(user) {
      this.$router.push(`/chat/${user._id}`)
    },
    toggleAdd() {
      this.plusAnimation = !this.plusAnimation
      setTimeout(()=>{
        this.showAdd = !this.showAdd
      },1000)
    },
    async listUsers() {
      try {
        let res = await api.get('/all-users-list')
        this.users = res.data.users
        console.log(res.data.success)
        return console.log(res.data.message)
      } catch (e) {
        console.log(e)
        return console.log(e.message)
      }
    }
  },
  mounted() {
    this.listUsers()
  },
  computed: {
    ...mapGetters('auth', {
      currentUser: 'userDetails'
    })
  }
}
</script>

<template>
  <div>
    <transition name="fade" mode="out-in">
      <SearchUser 
        v-if="showAdd" 
        @close="toggleAdd" 
      />
      
      <div v-else class="messages__container">
        
        <div class="messages__title">
          <span>Messages</span> 
          
          <span class="add-btn" @click="toggleAdd">
            <transition name="icon-fade" mode="out-in">
              <font-awesome-icon
                :key="plusAnimation"
                :icon="plusAnimation ? ['fas','square-plus'] : ['fas','plus']"
                class="add-icon"
              />
            </transition>
            Add
          </span>
        </div>

        <div
          v-for="user in users"
          :key="user._id"
          class="message__card"
          @click="openChat(user)"
        >
          <div class="avatar" style="padding: 1px;">
            <img :src="user.avatar" alt="">
          </div>

          <div class="message__info">
            <p class="username">{{ user.name }}</p>
            <p class="last__message">{{ user.bio }}</p>
          </div>

          <div class="time">{{ new Date(user.updatedAt).toLocaleTimeString([],{
            hour:'2-digit',
            minute:'2-digit'
          }) }}</div>
        
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Container for the messages view */
.messages__container {
  min-height: 100vh;
  background-color: rgb(32, 17, 6);
  padding: 1rem;
  padding-bottom: 90px; /* space for bottom nav */
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.messages__title {
  font-weight: 700;
  color: rgb(255, 222, 179);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

/* icon base */
.add-icon {
  font-size: 1.3rem;
}

/* ===== ICON TRANSITION ===== */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s ease-in;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.7) rotate(-90deg);
}

.icon-fade-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0);
}

.icon-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
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

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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