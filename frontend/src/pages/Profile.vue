<script>
  export default {
    name: 'Profile',
    data() {
      return {
        user: {
          name: 'Jacob West',
          username: 'pixsellz',
          bio: 'Digital goodies designer\nEverything is designed.',
          posts: 54,
          followers: 834,
          following: 162
        },
        activeTab: 'grid',
        posts: [
          {
            id: 1,
            img: 'https://picsum.photos/id/1015/400/400',
            likes: 128,
            comments: 24
          },
          {
            id: 2,
            img: 'https://picsum.photos/id/1016/400/400',
            likes: 86,
            comments: 12
          },
          {
            id: 3,
            img: 'https://picsum.photos/id/1021/400/400',
            likes: 210,
            comments: 40
          }
        ],
        showOptions: null,
        showSettings: false,
        showLike:null,
      }
    },
    methods: {
      toggleOptions(id) {
        this.showOptions = this.showOptions === id ? null : id
      },
      showSettingsModal(id){
        this.showSettings = !(this.showSettings)
      },
      toggleLike(id){
        this.showLike = !(this.showLike)
        // this.showLike? this.posts.find(e => e.id == id).likes ++ : this.posts.find(e => e.id == id).likes --
        this.posts.find(e => e.id == id).likes += this.showLike? 1:-1
      }
    }
  }
  </script>
  
  <template>
    <div class="profile-page">
      <!-- HEADER -->
      <div class="profile__header">
        <i class="bi bi-gear settings__icon" @click="showSettingsModal(3)"></i>
        <div v-if="showSettings" class="settings__options-container">
          <p class="text-danger" style="border-bottom:2px solid rgb(77, 31, 5)"><i class="bi bi-trash"></i> Delete Account</p>
          <p class="text-danger" ><i class="bi bi-power"></i> Log out</p>
        </div>
        <p>{{ user.name }}</p>
        <span></span>
      </div>
  
      <!-- PROFILE INFO -->
      <div class="profile__info">
        <div class="profile__top">
          <div class="avatar">
            <img
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`"
            />
          </div>
  
          <div class="stats">
            <div class="stat">
              <p class="number">{{ user.posts }}</p>
              <p>Posts</p>
            </div>
            <div class="stat">
              <p class="number">{{ user.followers }}</p>
              <p>Followers</p>
            </div>
            <div class="stat">
              <p class="number">{{ user.following }}</p>
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
          <button class="edit">Edit Profile</button>
          <button class="share">Share</button>
        </div>
      </div>
  
      <!-- POSTS -->
      <div class="profile__posts">
        <!-- Tabs -->
        <div class="tabs">
          <div
            class="tab"
            :class="{ active: activeTab === 'grid' }"
            @click="activeTab = 'grid'"
          >
            <i class="bi bi-grid-3x3"></i>
          </div>
  
          <div
            class="tab"
            :class="{ active: activeTab === 'view' }"
            @click="activeTab = 'view'"
          >
            <i class="bi bi-card-image"></i>
          </div>
        </div>
  
        <!-- GRID -->
        <div v-if="activeTab === 'grid'" class="grid">
          <div
            v-for="post in posts"
            :key="post.id"
            class="post"
          >
            <img :src="post.img" />
          </div>
        </div>
  
        <!-- SINGLE POST VIEW -->
        <div v-else class="post-view-wrapper">
          <div class="post-viewer">
            <div
              v-for="post in posts"
              :key="post.id"
              class="viewer-post"
            >
            <div class="post__header">
              <div class="post__avatar--container">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`" alt=""> 
                <span>{{ user.name }}</span>
              </div>
              
              <div class="right">
                  <i
                    class="bi bi-three-dots text-white"
                    @click="toggleOptions(post.id)"
                  ></i>
  
                  <div
                    v-if="showOptions === post.id"
                    class="options"
                  >
                    <p class="delete"><i class="bi bi-trash"></i> <span>Delete Post</span></p>
                  </div>
                </div>
            </div>
            
             <div class="viewer-post__image--container">
              <img :src="post.img" />
             </div>
  
              <div class="post-actions">
                <div class="left">
                  <span>
                    <i class="bi" :class="showLike?'bi-heart-fill':'bi-heart'" @click="toggleLike(post.id)"></i> {{ post.likes }} 
                  </span>
                  <span>
                    <i
  class="bi bi-chat"
  @click="$router.push(`/comments/${post.id}`)"
></i>
 {{ post.comments }}
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

.settings__icon{
  position:relative;
}
.settings__options-container{
  /* width: 200px; */
  position:absolute;
  top: 5%;
  left:10%;
  border-radius: 7px;
  padding:5px;
  background-color: rgb(56, 24, 5);
  border: 2px solid rgb(77, 31, 5);

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
  }
  
  .share {
    background: rgb(51, 34, 28);
    color: rgb(255, 222, 179);
    border: 1px solid #ffb78e;
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
    object-fit: cover;
  }
  
  /* POST ACTIONS */
  .post-view-wrapper{
    margin-top: 15px;
  }
  .viewer-post__image--container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 👈 centers image + content */
}
.viewer-post__image--container img {
  width: 100%;
  max-width: 100%;
  display: block;
  object-fit: cover;
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
  .post__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .post__avatar--container{
      width: 45px;
    height: 45px;
    border-radius: 50%;
    padding: 3px;
    background: #ffb78e;
    position: relative;
    margin:0 3px 3px 3px;

    
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    span{
      position: absolute;
      top:50%;
      left:120%;
      transform: translateY(-50%);
      z-index: 7;
      color: #ffb78e;
      font-size: 1rem;
      font-weight: 600;
      font-family: monospace;
      text-transform: lowercase;
      width:max-content;

    }
    }
    
  }
  .right {
    position: relative;
    margin-right:20px;
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
    span{
      font-size: .8rem;
    }
  }
  .left{
    font-size: 1.25rem;
    width:100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;

  }
  </style>
  