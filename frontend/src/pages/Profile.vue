<script>
import api from '@/services/api';
import post from '@/store/modules/post';
import DeleteAlert from '@/components/DeleteAlert.vue';

import { mapActions, mapGetters } from 'vuex';
// import { faL } from '@fortawesome/free-solid-svg-icons';
export default {
  name: 'Profile',
  components:{
    DeleteAlert
  },
  data() {
    return {
      // user: {
      //   name: 'Jacob West',
      //   username: 'pixsellz',
      //   bio: 'Digital goodies designer\nEverything is designed.',
      //   posts: 54,
      //   followers: 834,
      //   following: 162
      // },
      // user:null,
      activeTab: 'grid',
      // posts: [
      //   {
      //     id: 1,
      //     img: 'https://picsum.photos/id/1015/400/400',
      //     likes: 128,
      //     comments: 24
      //   },
      //   {
      //     id: 2,
      //     img: 'https://picsum.photos/id/1016/400/400',
      //     likes: 86,
      //     comments: 12
      //   },
      //   {
      //     id: 3,
      //     img: 'https://picsum.photos/id/1021/400/400',
      //     likes: 210,
      //     comments: 40
      //   }
      // ],
      posts:[],
      showOptions: null,
      showSettings: false,
      showLike: null,
      logoutStatus: null,
      deleteAlert:false,
      showDeleteModal:false,
      isDeleting:false,
      showDeletePostModal:false,
      postToDeleteId: null,
    }
  },
  methods: {
    openDeletePostModal(id) {
    this.postToDeleteId = id; // Remember which post
    this.showDeletePostModal = true; // Show modal
    this.showOptions = null; // Close the little menu
  },

  // 2. CONFIRM DELETE
  async confirmDeletePost() {
    if (!this.postToDeleteId) return;

    try {
      this.isDeleting = true;
      // Call API
      await api.get(`/delete-post/${this.postToDeleteId}`); // Note: ensure API is .delete, not .get

      // Update UI
      this.posts = this.posts.filter(post => post._id !== this.postToDeleteId);
      
      // Close Modal
      this.showDeletePostModal = false;
      this.postToDeleteId = null;

    } catch (e) {
      console.log(e);
      alert("Failed to delete post");
    } finally {
      this.isDeleting = false;
    }
  },







    toggleOptions(id) {
      this.showOptions = this.showOptions === id ? null : id
    },
    showSettingsModal(id) {
      this.showSettings = !(this.showSettings)
    },
    toggleLike(id) {
      this.showLike = !(this.showLike)
      // this.showLike? this.posts.find(e => e.id == id).likes ++ : this.posts.find(e => e.id == id).likes --
      this.posts.find(e => e.id == id).likes += this.showLike ? 1 : -1
    },
    // async showDeleteAccountAlert(){
    //   this.deleteAlert = true

    // },
async deleteAccount(){
  try{
    this.isDeleting = true
    await api.get('/delete-account')
  this.$router.push('/login')
  }catch(e){
    console.log(e)

  }finally{
    this.isDeleting = false
  }
},
  // async deletePost(postId) {
  //   // 1. Ask for confirmation so users don't delete by accident
  //   const confirmDelete = confirm("Are you sure you want to delete this post?");
  //   if (!confirmDelete) return;

  //   try {
  //     // 2. Call the API
  //     await api.get(`/delete-post/${postId}`);

  //     // 3. Optimistic Update: Remove it from the screen immediately
  //     // This filters the 'posts' array to keep everything EXCEPT the one we deleted
  //     this.posts = this.posts.filter(post => post._id !== postId);

  //     // 4. Close the options menu
  //     this.showOptions = null;

  //   } catch (e) {
  //     console.log(e);
  //     alert("Failed to delete post");
  //   }
  // },
  // DeletePostModal(id){
  //   this.showDeletePostModal = true
  // },

    
    async handleLogout() {
      try {
        // const res = await api.get('/logout')
        setTimeout(() => {
          console.log("loading..")
        }, 1000)
        await this.logout()
        this.logoutStatus = this.loggedIn

        this.$router.push('/login')

      } catch (e) {
        console.log(e)
        console.log('logout failed')
      }
    },
    // async userCall(){
    //   const res = await api.get('/profile')
    //   console.log(res.data.data)
    //   this.user = res.data.data
    // },
    ...mapActions("auth", ["fetchUser", "logout"]),
    editProfile() {
      setTimeout(() => {
        this.$router.push('/edit-profile')
      }, 1000)
    },
    async shareProfile() {
      const userId = this.user._id
      const url = `${window.location.origin}/chat/${userId}`

      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(url)
          alert('Chat link copied to clipboard!')
          return
        } catch (err) {
          console.warn('Clipboard API failed, using fallback')
        }
      }

      // ✅ Fallback (WORKS 100%)
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)

      alert('Chat link copied to clipboard!')
    },
    async fetchPosts(){
      try{
        let res = await api.get(`/userposts/${this.user._id}`)
        this.posts = res.data.posts
      }catch(e){
        console.log(e)
      }
    }


  },
  computed: {
    ...mapGetters("auth", {
      user: "userDetails",
      loggedIn: "isLoggedIn"
    })
  },
  created() {
    // this.userCall()
    this.fetchUser().then(this.fetchPosts)
  }
}
</script>

<template>
  <div class="profile-page" v-if="user">
    <!-- HEADER -->
    <div class="profile__header">
      <i class="bi bi-gear settings__icon" @click="showSettingsModal(3)"></i>
      <transition name="settings-pop">
  <div
    v-if="showSettings"
    class="settings__options-container"
  >
    <p class="danger" @click="showDeleteModal = true">
      <i class="bi bi-trash"></i>
      Delete Account
    </p>

    <p class="danger" @click="handleLogout">
      <div
        class="spinner-border spinner-border-sm"
        role="status"
        v-if="logoutStatus"
        :style="{ color: '#ff6b6b' }"
      ></div>
      <i class="bi bi-power" v-else></i>
      Log out
    </p>
  </div>
</transition>

      <p>{{ user.name }}</p>
      <span></span>
    </div>

<!--    DELETE CONFIRMATION MESSAGE BOX -->


<transition name="fade">
      <DeleteAlert 
        v-if="showDeleteModal"
        title="Delete Account?"
        message="You are about to permanently delete your account and all your data."
        :loading="isDeleting"
        @cancel="showDeleteModal = false"
        @delete="deleteAccount"
      />
    </transition>






    <!-- PROFILE INFO -->
    <div class="profile__info">
      <div class="profile__top">
        <div class="avatar">
          <img :src="user.avatar" />
        </div>

        <div class="stats">
          <div class="stat">
            <p class="number">{{ posts.length}}</p>
            <p>Posts</p>
          </div>
          <div class="stat">
            <p class="number">{{ user.followers.length }}</p>
            <p>Followers</p>
          </div>
          <div class="stat">
            <p class="number">{{ user.following.length }}</p>
            <p>Following</p>
          </div>
        </div>
      </div>

      <div class="bio">
        <p class="name">{{ user.name }}</p>
        <p class="username">@{{ user.username }}</p>
        <p class="bio-text">{{ user.bio }}</p>
      </div>

      <div class="actions">
        <button class="edit" @click="editProfile">Edit Profile</button>
        <button class="share" @click="shareProfile">Share</button>
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
                <img :src="user.avatar" alt="">
                <span>{{ user.name }}</span>
              </div>

              <div class="right">
                <i class="bi bi-three-dots text-white" @click="toggleOptions(post._id)"></i>

                <div v-if="showOptions === post._id" class="options">
    <p class="delete" @click="openDeletePostModal(post._id)">
        <i class="bi bi-trash"></i> 
        <span>Delete Post</span>
    </p>
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
                  <i class="bi" :class="showLike ? 'bi-heart-fill' : 'bi-heart'" @click="toggleLike(post._id)"></i> {{
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
    <transition name="fade">
    <DeleteAlert 
      v-if="showDeletePostModal"
      title="Delete Post?"
      :message="`Are you sure you want to remove this post? Id: ${postToDeleteId}`"
      :loading="isDeleting"
      @cancel="showDeletePostModal = false"
      @delete="confirmDeletePost"
    />
  </transition>
  </div>
</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');


.profile-page {
  background: rgb(32, 17, 6);
  
  /* ❌ Remove this: */
  /* min-height: 100vh; */

  /* ✅ Add this: */
  height: 100vh;        /* Limits the div to the screen height */
  overflow-y: auto;     /* Enables scrolling INSIDE this div */
  padding-bottom: 90px; /* Keeps space for your bottom nav */
}

/* Optional: Hide scrollbar for a cleaner mobile-app look */
.profile-page::-webkit-scrollbar {
  display: none;
}

/* HEADER */
.profile__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  color: rgb(255, 222, 179);
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
  /* width: 20%; */
  position: absolute;
  top: 55px;
  left: 12px;

  background: linear-gradient(
    145deg,
    rgb(66, 28, 6),
    rgb(44, 18, 4)
  );

  border-radius: 12px;
  padding: 7px;
  min-width: 190px;

  border: 1px solid rgb(97, 42, 10);

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  z-index: 50;

  display: flex;
  flex-direction: column;
  gap: 5px;
}


.settings__options-container p {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 2.5px 3.5px;
  margin-bottom: 100px;

  font-weight: 500;
  font-size: .7rem;

  border-radius: 10px;
  cursor: pointer;

  background: rgb(51, 21, 5);
  border: 1px solid rgb(97, 42, 10);

  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);

  transition: all 0.25s ease;
}

.settings__options-container p:last-child {
  margin-bottom: 0;
}

.settings__options-container p.danger {
  color: #ff6b6b;
}

.settings__options-container p:hover {
  transform: translateY(-1px);
  background: rgb(61, 26, 7);
}

.settings__options-container p:active {
  transform: scale(0.97);
  background: #8c2727;
}


.settings-pop-enter-active,
.settings-pop-leave-active {
  transition: all 0.25s ease;
}

.settings-pop-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.settings-pop-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}



.profile__header i {
  font-size: 1.8rem;
}

.profile__header p {
  font-size: 1.4rem;
  margin: 0;
}


/* DELETE ALERT BOX */


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
  padding: 3px 30px 3px 30px;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #ff6b6b;

  span {
    font-size: .8rem;
  }
}
.delete:active{
  background-color: #8c2727;
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