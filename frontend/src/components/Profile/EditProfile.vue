<script>
    export default {
      name: 'EditProfile',
      data() {
        return {
          user: {
            name: 'Jacob West',
            username: 'pixsellz',
            bio: 'Digital goodies designer\nEverything is designed.',
            posts: 54,
            followers: 834,
            following: 162
          }
        }
      }
    }
    </script>
    <template>
        <div class="profile__info--container">
      
          <!-- Top Row -->
          <div class="profile__top">
            
            <!-- Avatar -->
            <div class="avatar__wrapper">
              <img
                :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`"
                alt="avatar"
              />
            </div>
      
            <!-- Stats -->
            <div class="stats">
              <div class="stat">
                <p class="stat__number">{{ user.posts }}</p>
                <p class="stat__label">Posts</p>
              </div>
              <div class="stat">
                <p class="stat__number">{{ user.followers }}</p>
                <p class="stat__label">Followers</p>
              </div>
              <div class="stat">
                <p class="stat__number">{{ user.following }}</p>
                <p class="stat__label">Following</p>
              </div>
            </div>
      
          </div>
      
          <!-- Bio -->
          <div class="bio">
            <p class="name">{{ user.name }}</p>
            <p class="username">@{{ user.username }}</p>
            <p class="bio__text">
              {{ user.bio }}
            </p>
          </div>
      
          <!-- Buttons -->
          <div class="actions">
            <button class="action-btn edit">Edit Profile</button>
            <button class="action-btn share">Share</button>
          </div>
      
        </div>
      </template>
      <style scoped>
        .profile__info--container {
  padding: 1rem;
  background-color: rgb(32, 17, 6);
  color: rgb(255, 222, 179);
}

/* Top section */
.profile__top {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Avatar */
.avatar__wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  padding: 3px;
  background: #ffb78e;
}

.avatar__wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgb(51, 34, 28);
}

/* Stats */
.stats {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.stat {
  text-align: center;
}

.stat__number {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.stat__label {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
}

/* Bio */
.bio {
  margin-top: 0.8rem;
}

.name {
  font-weight: 600;
  margin: 0;
}

.username {
  color: #ffb78e;
  font-size: 0.9rem;
  margin: 0.1rem 0;
}

.bio__text {
  font-size: 0.9rem;
  line-height: 1.3;
  white-space: pre-line;
  opacity: 0.9;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}

.action-btn {
  flex: 1; /* 50 / 50 */
  border: none;
  padding: 0.6rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

/* Edit */
.action-btn.edit {
  background-color: rgb(255, 222, 179);
  color: rgb(51, 34, 28);
}

/* Share */
.action-btn.share {
  background-color: rgb(51, 34, 28);
  color: rgb(255, 222, 179);
  border: 1px solid #ffb78e;
}

.action-btn:hover {
  transform: scale(1.03);
}

      </style>