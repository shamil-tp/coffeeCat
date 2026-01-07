<script>
import api from '@/services/api';

export default {
  name: 'SearchUser',
  data() {
    return {
      query: '',
      loading: false,
      // user: {
      //   _id: 'demo123',
      //   name: 'LILA SIMMONS',
      //   username: 'lilasimmons',
      //   bio: 'Professional Artist',
      //   avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
      //   postsCount: 62,
      //   followers: Array(120),
      //   following: Array(47)
      // },
      user:null,
      postCount:null
      // username:null,
    }
  },
  methods: {
    goBack() { this.$emit('close') },
    async searchUser() {
      if (!this.query.trim()) return
      this.loading = true
      const formData = new FormData()
      formData.append('username',this.query)
      console.log(formData)
      let res = await api.post('/search-user',formData)
      this.user = res.data.user
      this.postCount = res.data.postCount
      setTimeout(() => {
        this.loading = false
      }, 800)
    },
    viewProfile(){
      this.loading = true
      this.$router.push(`/view-profile/${this.user._id}`)
    },
  }
}
</script>
<template>
  <div class="search-user">

    <div class="header">
      <font-awesome-icon icon="arrow-left" class="icon-btn" @click="goBack" />
      <h2>Search User</h2>
      <div style="width: 24px"></div>
    </div>

    <div v-if="loading" class="loading-state">
      <font-awesome-icon icon="spinner" spin />
      <p>Searching...</p>
    </div>

    <div class="profile-shell" v-else-if="user"> <div class="avatar-wrapper">
        <img :src="user.avatar || 'https://via.placeholder.com/150'" />
      </div>

      <div class="profile-card">
        
        <div class="text-content">
          <h4>{{ user.name }}</h4>
          <p class="subtitle">{{ user.bio }}</p>

          <div class="stats">
            <div class="stat-box">
              <p>Posts</p>
              <span>{{ postCount }}</span> 
            </div>
            <div class="stat-box">
              <p>Followers</p>
              <span>{{ user.followers ? user.followers.length : 0 }}</span>
            </div>
            <div class="stat-box">
              <p>Following</p>
              <span>{{ user.following ? user.following.length : 0 }}</span>
            </div>
          </div>
        </div>

        <div class="bottom-tab">
          <div class="actions">
            <button class="btn-primary" @click="viewProfile">

      <font-awesome-icon icon="spinner" spin v-if="loading" />
              <span v-else>Profile</span>


            </button>
            <button class="btn-secondary" @click="startMessage">Message</button>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="empty-state">
      <p>Type a username to find someone...</p>
    </div>

    <div class="search-floating-bar">
      <div class="search-inner">
        <font-awesome-icon icon="search" class="search-icon" />
        <input 
          type="text" 
          placeholder="Find a user..." 
          v-model="query" 
          @keyup.enter="searchUser"
        />
        <button class="go-btn" @click="searchUser">
          <font-awesome-icon icon="arrow-right" />
        </button>
      </div>
    </div>

  </div>
</template>
<style scoped>
  .empty-state {
  text-align: center;
  margin-top: 5rem;
  color: rgba(255, 222, 179, 0.5);
  font-size: 0.9rem;
}
/* --- GLOBAL LAYOUT --- */
.search-user {
    position: fixed;        /* Fix to viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;          /* Full height */
  z-index: 200;           /* Higher than BottomNav (100) */
  overflow-y: auto;


  min-height: 100vh;
  background: rgb(32, 17, 6); /* bg-main */
  padding: 1.5rem;
  color: rgb(255, 222, 179); /* text-primary */
  font-family: sans-serif;
  padding-bottom: 90px;
}

/* --- HEADER --- */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.icon-btn { font-size: 1.2rem; cursor: pointer; color: #ffb78e; }
.header h2 { margin: 0; font-weight: 700; letter-spacing: 1px; color: rgb(255, 222, 179); }

/* --- PROFILE SHELL --- */
/* --- PROFILE SHELL --- */
.profile-shell {
  position: relative;
  margin-top: 5rem;
  
  /* 👇 FIX: Constrain width so the shell doesn't stretch */
  width: 90%;          /* Occupies 90% of mobile screen */
  max-width: 360px;    /* Stops growing on tablets/desktop */
  
  /* Centers the shell horizontally */
  margin-left: auto;   
  margin-right: auto;
}

/* AVATAR */
.avatar-wrapper {
  position: absolute;
  
  /* 👇 FIX: Position relative to the constrained shell */
  top: -10px;          /* Pull up to overlap top edge */
  right: -10px;         /* Anchor to the right corner */
  
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 8px; 
  background: rgb(32, 17, 6); 
  z-index: 10;
  
  /* Removed transform: translateX because we aren't centering anymore */
}

.avatar-wrapper img {
  width: 100%; 
  height: 100%;
  border-radius: 50%; 
  object-fit: cover;
  /* border: 4px solid rgb(51, 34, 28); */
  border: 4px double #ff6b6b;
}

/* CARD */
.profile-card {
  background: rgb(51, 34, 28); /* bg-surface */
  color: rgb(255, 222, 179);
  padding: 1rem 1rem 0rem; 
  position: relative;
  z-index: 2;
  
  border-radius: 20px;
  border-top-left-radius: 40px;
  border-top-right-radius: 50px;
  
  text-align: left;
  /* Shadow using dark palette color instead of black */
  border: 3px double #ff6b6b;

  box-shadow: 0 20px 40px rgb(32, 17, 6); 
}

/* TEXT */
.profile-card h4 {
  margin: 0;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  color: rgb(255, 222, 179);
}

.subtitle {
  color: #ffb78e; /* text-secondary */
  font-weight: 500;
  font-size: 0.85rem;
  margin: 0.5rem 0 2rem;
  letter-spacing: 0.5px;
  text-transform: lowercase;
}

/* STATS */
.stats {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 0; 
  padding: 0 0.5rem 2.5rem;
}
.stat-box p {
  font-size: 0.7rem; color: #ffb78e;
  margin-bottom: 0.3rem; font-weight: 700;
  text-transform: uppercase;
}
.stat-box span {
  font-size: 1.2rem; font-weight: 700; color: rgb(255, 222, 179);
}

/* --- SMOOTH BOTTOM TAB --- */
.bottom-tab {
  position: relative;
  background: rgb(51, 34, 28); /* bg-surface */
  width: 85%;
  margin: 0 auto;
  /* height: 10px;  */
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* LIQUID CORNERS (Box Shadow Trick using BG-SURFACE color) */
/* .bottom-tab::before,
.bottom-tab::after {
  content: "";
  position: absolute;
  top: 0;
  width: 30px;
  height: 30px;
  background: transparent;
  z-index: 5;
} */

/* Left Curve
.bottom-tab::before {
  left: -30px;
  box-shadow: 15px -15px 0 rgb(51, 34, 28); /* bg-surface */
  /* border-top-right-radius: 30px; 
} */

/* Right Curve */
/* .bottom-tab::after {
  right: -30px; 
  box-shadow: -15px -15px 0 rgb(51, 34, 28); /* bg-surface */
  /* border-top-left-radius: 30px;
} */ 

/* BUTTONS */
.actions {
    width: 100%;
  display: flex;
  gap: 30px;
  /* margin-top: -8px; */
  justify-content: space-between;
  align-items: start;
  z-index: 5;
  transform: translateY(-50%);
}

button.btn-primary, button.btn-secondary {
  width: 100%;
  padding: 0.7rem 1.2rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 5;
}

/* Primary: Accent text on Muted BG */
.btn-primary {
  background: rgb(255, 222, 179); 
  color: rgb(51, 34, 28);
  border: 3px solid transparent;
}

/* Secondary: Outline */
.btn-secondary {
  background: transparent;
  color: rgb(255, 222, 179);
  border: 3px solid rgb(77, 31, 5); /* border-color */
}

/* --- SMALLER FLOATING SEARCH BAR --- */
.search-floating-bar {
  position: fixed;
  bottom: 1.5rem; /* Closer to bottom for mobile */
  left: 0; 
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem;
  z-index: 100;
}

.search-inner {
  /* Using Surface color, not darker */
  background: rgb(51, 34, 28); 
  border: 3px solid rgb(77, 31, 5); /* border-color */
  padding: 0.35rem; /* Smaller padding */
  border-radius: 50px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 340px; /* Constrained width */
  box-shadow: 0 8px 20px rgb(32, 17, 6); /* shadow using bg-main */
}

.search-icon {
  color: #ffb78e;
  margin-left: 0.8rem;
  font-size: 0.9rem;
}

.search-inner input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.6rem 0.6rem;
  color: rgb(255, 222, 179);
  font-size: 0.9rem; /* Smaller font */
}

.search-inner input:focus { outline: none; }
.search-inner input::placeholder { color: rgb(255, 222, 179); opacity: 0.5; font-weight: 600;font-family: monospace;}

.go-btn {
  width: 36px; height: 36px; /* Smaller button */
  border-radius: 50%;
  background: rgb(255, 222, 179);
  color: rgb(51, 34, 28);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
}

/* LOADING */
.loading-state {
  text-align: center;
  margin-top: 5rem;
  color: #ffb78e;
}
</style>