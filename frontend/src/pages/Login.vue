<script>
    export default {
      name: 'Login',
      data() {
        return {
          email: '',
          password: ''
        }
      },
      methods: {
        login() {
          // backend later
          console.log(this.email, this.password)
        }
      }
    }
    </script>
    
    <template>
      <div class="auth-page">
        <div class="auth-card">
          <h2>Welcome back ☕</h2>
          <p class="subtitle">Login to Coffee Cat</p>
    
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
    
          <button @click="login">Log In</button>
    
          <p class="switch">
            Don’t have an account?
            <router-link to="/signup">Sign up</router-link>
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
    
    .auth-card h2 {
      color: rgb(255, 222, 179);
      margin-bottom: 0.3rem;
    }
    
    .subtitle {
      color: #ffb78e;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
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