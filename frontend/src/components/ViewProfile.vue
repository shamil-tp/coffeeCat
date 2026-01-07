<script>
import api from '@/services/api';
import post from '@/store/modules/post';
import { mapGetters } from 'vuex';
export default {
  name: 'ViewProfile',
  data() {
    return {
        profile:null,
      activeTab: 'grid',
      posts:[],
      showOptions: null,
      showSettings: false,
      showLike: null,
      logoutStatus: null,
    }
  },
  methods: {
    toggleOptions(id) {
      this.showOptions = this.showOptions === id ? null : id
    },
    async startMessage(){
      try{
        let res = await api.post(`/chat/user/${this.profile._id}`)
        this.$router.push(`/chat/${res.data.chat._id}`)
        console.log(res.data.chat)
      }catch(e){
        console.log(e)
      }
    },
    async toggleLike(id) {
      //    THIS IS ADDING LIKES STATIC
      // this.showLike = !(this.showLike)
      // this.showLike? this.posts.find(e => e.id == id).likes ++ : this.posts.find(e => e.id == id).likes --
      // this.posts.find(e => e.id == id).likes += this.showLike ? 1 : -1

      //    OPTIMISTIC UI

      const post = this.posts.find(p => p._id === id);
      if (!post) return;

      const currentUserId = this.currentUser._id;

      if (post.likes.includes(currentUserId)) {
        post.likes = post.likes.filter(uid => uid !== currentUserId);
      } else {
        post.likes.push(currentUserId);
      }
      
      
      //    ADDING LIKES DYNAMIC
      let res = await api.post(`/toggle-like/${id}`)
      // this.showLike = this.posts.find( post => post._id == id).likes.includes(this.currentUser._id)
      
      console.log(res.data.message)
    },
    async getUserDetails(){
        try{
            let res = await api.get(`/get-profiledetails/${this.$route.params.id}`)
            this.profile = res.data.profile

        }catch(e){
            console.log(e)
        }
    },
    editProfile() {
      setTimeout(() => {
        this.$router.push('/edit-profile')
      }, 1000)
    },
    async fetchPosts(){
      try{
        let res = await api.get(`/userposts/${this.$route.params.id}`)
        this.posts = res.data.posts
      }catch(e){
        console.log(e)
      }
    },
    async handleFollow() {
      if (!this.currentUser) return alert("Please login to follow");

      // 1. Store the previous state in case api fails
      const previousFollowers = [...this.profile.followers];

      try {
        // 2. OPTIMISTIC UI UPDATE (Update screen immediately before waiting for server)
        if (this.isFollowing) {
           // If unfollowing: Filter my ID out
           this.profile.followers = this.profile.followers.filter(id => id !== this.currentUser._id);
        } else {
           // If following: Push my ID in
           this.profile.followers.push(this.currentUser._id);
        }

        // 3. Call the API
        await api.post(`/toggle-follow/${this.profile._id}`, {
          currentUserId: this.currentUser._id
        });

      } catch (e) {
        console.log(e);
        // If server fails, revert the change
        this.profile.followers = previousFollowers;
      }
    },
    

  },
  computed: {
    ...mapGetters("auth", {
      currentUser: "userDetails",
      loggedIn: "isLoggedIn"
    }),
    isFollowing() {
      if (!this.profile || !this.currentUser || !this.profile.followers) return false;
      // Check if my ID exists in the profile's followers array
      return this.profile.followers.includes(this.currentUser._id);
    }
  },
  created() {
    // this.userCall()
    this.getUserDetails().then(this.fetchPosts)
  },
  watch: {
    '$route.params.id': function(newId) {
        if(newId) {
            this.profile = null; // Reset to show loading state
            this.posts = [];
            this.getUserDetails();
            this.fetchPosts();
        }
    }
  }
  
}
</script>

<template>
  <div class="profile-page" v-if="profile">
    <!-- HEADER -->
    <div class="profile__header">
      <p>{{ profile.name }}</p>
      <span></span>
    </div>

    <!-- PROFILE INFO -->
    <div class="profile__info">
      <div class="profile__top">
        <div class="avatar">
          <img :src="profile.avatar" />
        </div>

        <div class="stats">
          <div class="stat">
            <p class="number">{{ posts.length }}</p>
            <p>Posts</p>
          </div>
          <div class="stat">
            <p class="number">{{ profile.followers.length }}</p>
            <p>Followers</p>
          </div>
          <div class="stat">
            <p class="number">{{ profile.following.length }}</p>
            <p>Following</p>
          </div>
        </div>
      </div>

      <div class="bio">
        <p class="name">{{ profile.name }}</p>
        <p class="username">@{{ profile.username }}</p>
        <p class="bio-text">{{ profile.bio }}</p>
      </div>

      <div class="actions">
    <button 
      :class="['edit', { 'following-style': isFollowing }]" 
      @click="handleFollow"
    >
      {{ isFollowing ? 'Unfollow' : 'Follow' }}
    </button>
    
    <button class="share" @click="startMessage">Message</button>
</div>
    </div>

    <!-- POSTS -->
    <div class="profile__posts">
      <!-- Tabs -->
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'grid' }" @click="activeTab = 'grid'">
          <i class="bi bi-grid-3x3"></i>
        </div>

        <div class="tab" :class="{ active: activeTab === 'view' }" @click="activeTab = 'view'">
          <i class="bi bi-card-image"></i>
        </div>
      </div>

      <!-- GRID -->
      <div v-if="activeTab === 'grid'" class="grid">
        <div v-for="post in posts" :key="post._id" class="post">
          <img :src="post.image.url" />
        </div>
      </div>

      <!-- SINGLE POST VIEW -->
      <div v-else class="post-view-wrapper">
        <div class="post-viewer">
          <div v-for="post in posts" :key="post._id" class="viewer-post">
            <div class="post__header">
              <div class="post__avatar--container">
                <img :src="profile.avatar" alt="">
                <span>{{ profile.name }}</span>
              </div>

              <div class="right">
                <i class="bi bi-three-dots text-white" @click="toggleOptions(post._id)"></i>

                <div v-if="showOptions === post._id" class="options">
                  <p class="delete"><i class="bi bi-trash"></i> <span>Delete Post</span></p>
                </div>
              </div>
            </div>

            <div class="viewer-post__image--container">
              <img :src="post.image.url" />
            </div>
            <div class="post__caption">
              <span>{{ post.caption }}</span>
            </div>
            <div class="post-actions">
              <div class="left">
                <span>
                  <i class="bi" :class="post.likes.includes(this.currentUser._id) ? 'bi-heart-fill' : 'bi-heart'" @click="toggleLike(post._id)"></i> {{
                  post.likes.length }}
                </span>
                <span>
                  <i class="bi bi-chat" @click="$router.push(`/comments/${post._id}`)"></i>
                  {{ post.commentsCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  background: rgb(32, 17, 6);
  min-height: 100vh;
  padding-bottom: 90px;
}

/* HEADER */
.profile__header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 1rem;
  color: rgb(255, 222, 179);
  font-size: .8rem;
  font-weight: 700;
  /* position: relative; */
}

/* icon */
.profile__header i {
  transition: transform 1s ease-in-out;
}

/* hover spin */
.profile__header i:hover {
  transform: rotate(180deg);
}

.settings__icon {
  position: relative;
}

.settings__options-container {
  /* width: 200px; */
  position: absolute;
  top: 8%;
  left: 1.5%;
  border-radius: 7px;
  padding: 5px;
  background-color: rgb(56, 24, 5);
  border: 2px solid rgb(77, 31, 5);
  /* transform: translate(300px, 100px); */
  transition: 1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;

}

.settings__options-container p {
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
}


.profile__header i {
  font-size: 1.8rem;
}

.profile__header p {
  font-size: 1.4rem;
  margin: 0;
}

/* INFO */
.profile__info {
  padding: 1rem;
  color: rgb(255, 222, 179);
}

.profile__top {
  display: flex;
  gap: 1rem;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  padding: 3px;
  background: #ffb78e;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.stats {
  flex: 1;
  display: flex;
  justify-content: space-around;
}

.stat {
  text-align: center;
}

.number {
  font-weight: 600;
}

.bio {
  margin-top: 1rem;
}

.username {
  color: #ffb78e;
}

.bio-text {
  white-space: pre-line;
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}

.actions button {
  flex: 1;
  padding: 0.6rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
}

.edit {
  background: rgb(255, 222, 179);
  color: rgb(51, 34, 28);
  border: 1px solid transparent;
  transition: 0.3s ease;
  transform-origin: center;
}

.edit:hover {
  background: rgb(51, 34, 28);
  color: rgb(255, 222, 179);
  border: 1px solid #ffb78e;
  transform: scale(1.03);
}

.share {
  background: rgb(51, 34, 28);
  color: rgb(255, 222, 179);
  border: 1px solid #ffb78e;
  transition: 0.3s ease;

}

.share:hover {
  background: rgb(255, 222, 179);
  color: rgb(51, 34, 28);
  border: 1px solid transparent;
  transform: scale(1.03);
}
/* Style for when you are already following */
.following-style {
    background: transparent;
    border: 1px solid #ffb78e;
    color: #ffb78e;
}
.following-style:hover {
    background: rgba(255, 183, 142, 0.1);
    color: #ffb78e;
}

/* TABS */
.tabs {
  display: flex;
  border-top: 1px solid rgb(51, 34, 28);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 0.7rem;
  color: rgb(255, 222, 179);
  opacity: 0.6;
}

.tab.active {
  opacity: 1;
  border-bottom: 2px solid #ffb78e;
  color: #ffb78e;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.post {
  aspect-ratio: 1 / 1;
}

.post img {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  object-fit: cover;
}

/* POST ACTIONS */
.post-view-wrapper {
  margin-top: 15px;
}

.viewer-post__image--container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 👈 centers image + content */
}

.viewer-post__image--container img {
  width: 100%;
  max-width: 100%;
  display: block;
  object-fit: cover;
}
.post__caption{
  font-size: 1rem;
  font-weight: 600;
  font-family: monospace;
  color: #ff6b6b;
  background-color: rgb(77, 31, 5);
}
.post__caption span{
  margin-left: 10px;
}
.post-actions {
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  color: rgb(255, 222, 179);
  margin-bottom: 20px;
}

.post__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .post__avatar--container {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    padding: 3px;
    background: #ffb78e;
    position: relative;
    margin: 0 3px 3px 3px;


    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    span {
      position: absolute;
      top: 50%;
      left: 120%;
      transform: translateY(-50%);
      z-index: 7;
      color: #ffb78e;
      font-size: 1rem;
      font-weight: 600;
      font-family: monospace;
      text-transform: lowercase;
      width: max-content;

    }
  }

}

.right {
  position: relative;
  margin-right: 20px;
  font-size: 2rem;

}

/* OPTIONS */
.options {
  position: absolute;
  right: 50%;
  top: -3.1rem;
  /* scale: 1.5; */
  width: max-content;
  height: auto;
  background: rgba(51, 34, 28, 0);
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  translate: -20px 60px;
  height: 40px;
  /* justify-content: center; */
}

.options .delete {
  color: #ff6b6b;
  font-size: 1.25rem;
  font-weight: 700;
  background: rgb(51, 34, 28);
  padding: 3px;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #ff6b6b;

  span {
    font-size: .8rem;
  }
}

.left {
  font-size: 1.25rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;

}
</style>