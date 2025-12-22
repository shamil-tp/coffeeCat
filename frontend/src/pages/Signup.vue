<script>
    export default {
      name: 'Signup',
      data() {
        return {
          name: '',
          username: '',
          email: '',
          password: '',
          avatar: null,
          avatarPreview: null
        }
      },
      methods: {
        pickImage() {
          this.$refs.avatarInput.click()
        },
        onImageSelected(event) {
          const file = event.target.files[0]
          if (!file) return
    
          this.avatar = file
          this.avatarPreview = URL.createObjectURL(file)
        },
        signup() {
          console.log({
            name: this.name,
            username: this.username,
            email: this.email,
            password: this.password,
            avatar: this.avatar
          })
        }
      }
    }
    </script>
    
    <template>
      <div class="auth-page">
        <div class="auth-card">
    
          <!-- DP UPLOAD -->
          <div class="avatar-section" @click="pickImage">
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              class="avatar-img"
            />
            <div v-else class="avatar-placeholder">
              <span>+</span>
            </div>
    
            <input
              type="file"
              accept="image/*"
              ref="avatarInput"
              hidden
              @change="onImageSelected"
            />
          </div>
    
          <h2>Create account ☕</h2>
          <p class="subtitle">Join Coffee Cat</p>
    
          <input
            type="text"
            placeholder="Full name"
            v-model="name"
          />
    
          <input
            type="text"
            placeholder="Username"
            v-model="username"
          />
    
          <input
            type="email"
            placeholder="Email"
            v-model="email"
          />
    
          <input
            type="password"
            placeholder="Password"
            v-model="password"
          />
    
          <button @click="signup">Sign Up</button>
    
          <p class="switch">
            Already have an account?
            <router-link to="/login">Log in</router-link>
          </p>
        </div>
      </div>
    </template>
    
    <style scoped>
    .auth-page {
      min-height: 100vh;
      background: rgb(32, 17, 6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    
    .auth-card {
      width: 100%;
      max-width: 380px;
      background: rgb(51, 34, 28);
      padding: 1.8rem;
      border-radius: 18px;
      text-align: center;
    }
    
    /* AVATAR */
    .avatar-section {
      width: 96px;
      height: 96px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      background: rgb(32, 17, 6);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px dashed #ffb78e;
    }
    
    .avatar-placeholder span {
      font-size: 2rem;
      color: #ffb78e;
    }
    
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .auth-card h2 {
      color: rgb(255, 222, 179);
      margin-bottom: 0.3rem;
    }
    
    .subtitle {
      color: #ffb78e;
      font-size: 0.9rem;
      margin-bottom: 1.2rem;
    }
    
    input {
      width: 100%;
      padding: 0.7rem 1rem;
      margin-bottom: 0.8rem;
      border-radius: 999px;
      border: none;
      outline: none;
      background: rgb(32, 17, 6);
      color: rgb(255, 222, 179);
    }
    
    input::placeholder {
      color: #ffb78e;
      opacity: 0.7;
    }
    
    button {
      width: 100%;
      padding: 0.7rem;
      margin-top: 0.5rem;
      border-radius: 999px;
      border: none;
      font-weight: 600;
      background: #ffb78e;
      color: rgb(51, 34, 28);
    }
    
    .switch {
      margin-top: 1rem;
      font-size: 0.85rem;
      color: rgb(255, 222, 179);
    }
    
    .switch a {
      color: #ffb78e;
      text-decoration: none;
      font-weight: 600;
    }
    </style>
    