<script>
import api from "@/services/api";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      statusMessage: null,
      loginStatus: null,
    };
  },
  methods: {
    async login() {
      try {
        if (!this.email) {
          this.statusMessage = "Email is empty";
          this.loginStatus = false;
          return "login fail";
        }
        if (!this.password) {
          this.statusMessage = "Password is empty";
          this.loginStatus = false;
          return "login fail";
        }
        const res = await api.post("/login", {
          email: this.email,
          password: this.password,
        });
        this.loginStatus = res.data.success;
        this.statusMessage = res.data.message;
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      } catch (e) {
        this.loginStatus = false;
        this.statusMessage = "Login Error";
        return console.error(e.response?.message);
      }
    },
  },
};
</script>

<template>
  <form class="auth-page" @submit.prevent="login">
    <div class="auth-card">
      <h2>Welcome back ☕</h2>
      <p class="subtitle">Login to Coffee Cat</p>

      <input type="email" placeholder="Email" v-model="email" />

      <input type="password" placeholder="Password" v-model="password" />

      <button type="submit">Log In</button>

      <p
        v-if="statusMessage"
        :style="{
          fontSize: '16px',
          fontWeight: '700',
          color: loginStatus ? '#9fff9f' : '#ff6b6b',
        }"
      >
        {{ statusMessage }}
        <div
  class="spinner-border spinner-border-sm"
  role="status"
  v-if="statusMessage"
  :style="{ 
          color: loginStatus ? '#9fff9f' : '#ff6b6b',
   }"
>
  <span class="visually-hidden">Loading...</span>
</div>

      </p>

      <p class="switch">
        Don’t have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </form>
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
