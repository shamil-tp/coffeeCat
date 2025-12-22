<script>
    export default {
      name: 'ProfilePosts',
      data() {
        return {
          activeTab: 'posts',
          posts: [
            'https://picsum.photos/id/1015/400/400',
            'https://picsum.photos/id/1016/400/400',
            'https://picsum.photos/id/1021/400/400',
            'https://picsum.photos/id/1035/400/400',
            'https://picsum.photos/id/1041/400/400',
            'https://picsum.photos/id/1050/400/400'
          ]
        }
      }
    }
    </script>
    <template>
        <div class="profile__posts--container">
      
          <!-- Tabs -->
          <div class="posts__tabs">
            <div
              class="tab"
              :class="{ active: activeTab === 'posts' }"
              @click="activeTab = 'posts'"
            >
              <i class="bi bi-grid-3x3"></i>
            </div>
      
            <div
              class="tab"
              :class="{ active: activeTab === 'tagged' }"
              @click="activeTab = 'tagged'"
            >
              <i class="bi bi-person-square"></i>
            </div>
          </div>
      
          <!-- Grid -->
          <div v-if="activeTab === 'posts'" class="posts__grid">
            <div
              v-for="(img, index) in posts"
              :key="index"
              class="post"
            >
              <img :src="img" alt="post" />
            </div>
          </div>
      
          <!-- Empty tagged -->
          <div v-else class="empty">
            <i class="bi bi-person-square"></i>
            <p>No tagged posts</p>
          </div>
      
        </div>
      </template>
      <style scoped>
        .profile__posts--container {
  background-color: rgb(32, 17, 6);
}

/* Tabs */
.posts__tabs {
  display: flex;
  border-top: 1px solid rgb(51, 34, 28);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 0.7rem 0;
  color: rgb(255, 222, 179);
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab i {
  font-size: 1.4rem;
}

.tab.active {
  opacity: 1;
  border-bottom: 2px solid #ffb78e;
  color: #ffb78e;
}

/* Grid */
.posts__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.post {
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.post img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Empty state */
.empty {
  text-align: center;
  padding: 2rem;
  color: rgb(255, 222, 179);
  opacity: 0.6;
}

.empty i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
/* Grid */
.posts__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.post {
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.post img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Empty state */
.empty {
  text-align: center;
  padding: 2rem;
  color: rgb(255, 222, 179);
  opacity: 0.6;
}

.empty i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

      </style>
    