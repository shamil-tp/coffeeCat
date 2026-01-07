<script>
import api from '@/services/api'
import { mapGetters } from 'vuex';

export default {
  name: 'EditProfile',
  data() {
    return {
      loading: false,
      statusMessage: null,
      success: null,

      form: {
        id:'',
        name: '',
        username: '',
        bio: '',
        avatar: null,
        avatarPreview: null
      }
    }
  },
  computed:{
    ...mapGetters('auth',{
      user:'userDetails',
      loggedIn:'isLoggedIn'
    })
  },
  methods: {
    goBack() {
        this.$router.back()
      },
      
    fetchUser() {
      try {
        this.form.id = this.user._id
        this.form.name = this.user.name
        this.form.username = this.user.username
        this.form.bio = this.user.bio || ''
        this.form.avatarPreview = this.user.avatar
      } catch (e) {
        console.log(e)
        console.error('Failed to fetch profile')
      }
    },

    onAvatarSelect(e) {
      const file = e.target.files[0]
      if (!file) return

      this.form.avatar = file
      this.form.avatarPreview = URL.createObjectURL(file)
    },

    async updateProfile() {
      try {
        this.loading = true
        this.statusMessage = null

        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('username', this.form.username)
        formData.append('bio', this.form.bio)

        if (this.form.avatar) {
          formData.append('avatar', this.form.avatar)
        }

        const res = await api.post('/update-profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        this.success = res.data.success
        this.statusMessage = res.data.message || 'Profile updated'

        if (this.success) {
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        }
      } catch (e) {
        this.success = false
        this.statusMessage = 'Update failed'
      } finally {
        this.loading = false
      }
    }
  },
  created() {
  if (!this.user) {
    this.$store.dispatch('auth/fetchUser')
  } else {
    this.fetchUser()
  }
}
,
watch: {
  user(newUser) {
    if (newUser) {
      this.fetchUser()
    }
  }
}

}
</script>

<template>
  <div class="chat-header">
      <span @click="goBack"><i class="bi bi-arrow-left"></i>Back</span>
    </div>

  <div class="edit-profile-page">
    <div class="edit-card">
      <h2>Edit Profile</h2>
      <p class="subtitle">Update your CoffeeCat profile</p>

      <!-- Avatar -->
      <div class="avatar-wrapper" @click="$refs.avatarInput.click()">
        <img :src="form.avatarPreview" alt="Avatar" />
        <span class="edit-overlay">Change</span>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          hidden
          @change="onAvatarSelect"
        />
      </div>

      <!-- Inputs -->
      <input
        type="text"
        placeholder="Name"
        v-model="form.name"
      />

      <input
        type="text"
        placeholder="Username"
        v-model="form.username"
      />

      <textarea
        placeholder="Bio"
        rows="3"
        v-model="form.bio"
      ></textarea>

      <!-- Button -->
      <button @click="updateProfile" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
        <span v-else>Save Changes</span>
      </button>

      <!-- Status -->
      <p
        v-if="statusMessage"
        :style="{
          color: success ? '#9fff9f' : '#ff6b6b',
          fontWeight: '700'
        }"
      >
        {{ statusMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>


/* PAGE */
.edit-profile-page {
  min-height: 100vh;
  background: rgb(32, 17, 6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}


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
.chat-header span{
  font-size: 1.6rem;
  color: rgb(255, 222, 179);
  font-weight: 700;
}
.chat-header i {
  font-size: 1.6rem;
  color: rgb(255, 222, 179);
  font-weight: 900;
  cursor: pointer;
}


/* CARD */
.edit-card {
  width: 100%;
  max-width: 420px;
  background: rgb(51, 34, 28);
  padding: 1.8rem;
  border-radius: 20px;
  text-align: center;
}

/* TEXT */
.edit-card h2 {
  color: rgb(255, 222, 179);
  margin-bottom: 0.2rem;
}

.subtitle {
  color: #ffb78e;
  font-size: 0.9rem;
  margin-bottom: 1.4rem;
}

/* AVATAR */
.avatar-wrapper {
  width: 110px;
  height: 110px;
  margin: 0 auto 1.2rem;
  border-radius: 50%;
  padding: 4px;
  background: #ffb78e;
  position: relative;
  cursor: pointer;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(32, 17, 6, 0.6);
  color: rgb(255, 222, 179);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.85rem;
  opacity: 0;
  transition: 0.3s;
}

.avatar-wrapper:hover .edit-overlay {
  opacity: 1;
}

/* INPUTS */
input,
textarea {
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 0.8rem;
  border-radius: 999px;
  border: none;
  outline: none;
  background: rgb(32, 17, 6);
  color: rgb(255, 222, 179);
}

textarea {
  border-radius: 16px;
  resize: none;
}

input::placeholder,
textarea::placeholder {
  color: #ffb78e;
  opacity: 0.7;
}

/* BUTTON */
button {
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.5rem;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  background: #ffb78e;
  color: rgb(51, 34, 28);
}

button:disabled {
  opacity: 0.7;
}

/* SPINNER */
.spinner-border {
  color: rgb(51, 34, 28);
}
</style>
