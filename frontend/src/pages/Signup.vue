<script>
import api from "@/services/api";
export default {
  name: "Signup",
  data() {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      avatar: null,
      avatarPreview: null,
      dpInvalid: null,
      signupMessage: null,
      signupStatus:null,
      dangerText:{
        fontWeight:'700',
        color:'#ff6b6b',
        fontSize:'16px'
      }
    };
  },
  methods: {
    pickImage() {
      this.$refs.avatarInput.click();
    },
    onImageSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.avatar = file;
      this.avatarPreview = URL.createObjectURL(file);
    },
    async signup() {
      try {
        if (!this.avatar) {
          this.dpInvalid = true;
          return "not registered";
        }
        if (!this.validation) {
          this.signupMessage = "Enter valid details for signup";
          return "not registered";
        }
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("username", this.username);
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("avatar", this.avatar); // MUST be File

        const res = await api.post("/signup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials:false,
        });
        console.log(res.data)
        console.log(res.data.success)
        console.log(res.data.message)
        if (res.data.success) {
          this.signupStatus = true
          this.signupMessage = res.data.message;
          setTimeout(() => {
            this.$router.push("/login");
          }, 1000);
        } else {
          this.signupStatus = false
          this.signupMessage = res.data.message;
        }
      } catch (err) {
        this.signupStatus = false
        console.error(err.response?.data || err.message);
      }
    },
  },
  computed: {
    isEmailValid() {
      if (!this.email) return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    },
    isUsernameValid() {
      if (!this.username) return false;
      return /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
        this.username
      );
    },
    isNameValid() {
      if (!this.name) return false;
      return (
        /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(this.name) &&
        this.name.length >= 2 &&
        this.name.length <= 40
      );
    },
    validation() {
      return this.isEmailValid && this.isUsernameValid && this.isNameValid;
    },
  },
};
</script>

<template>
  <form class="auth-page" @submit.prevent="signup">
    <div class="auth-card">
      <!-- DP UPLOAD -->
      <div class="avatar-section" @click="pickImage">
        <img v-if="avatarPreview" :src="avatarPreview" class="avatar-img" />
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
      <p :style="dangerText" v-if="dpInvalid">Add a DP</p>

      <h2>Create account ☕</h2>
      <p class="subtitle">Join Coffee Cat</p>

      <input type="text" placeholder="Full name" v-model="name" />

      <p :style="dangerText" v-if="this.name && !isNameValid">
        Name must not have number 2 spaces
      </p>

      <input type="text" placeholder="Username" v-model="username" />

      <p :style="dangerText" v-if="this.username && !isUsernameValid">
        Username must be 3–20 chars, letters, numbers, . or _
      </p>

      <input type="email" placeholder="Email" v-model="email" />

      <p :style="dangerText" v-if="this.email && !isEmailValid">
        Not valid Email
      </p>

      <input type="password" placeholder="Password" v-model="password" />

      <button type="submit">Sign Up</button>

      <!-- <p :style="{
        fontSize: '16px',
        fontWeight: '700',
        color: this.signupStatus ? '#9fff9f' : '#ff6b6b';
      }">{{ signupMessage }}</p> -->
      <p
  v-if="signupMessage"
  :style="{
    fontSize: '16px',
    fontWeight: '700',
    color: signupStatus ? '#9fff9f' : '#ff6b6b'
  }"
>
  {{ signupMessage }}
</p>


      <p class="switch">
        Already have an account?
        <router-link to="/login">Log in</router-link>
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
  box-shadow: inset 0 1px 2px rgb(95, 74, 74),0 2px 4px rgb(20, 20, 20),0 4px 8px rgb(51, 34, 28);

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
  box-shadow: inset 0 2px 4px rgb(95, 74, 74),0 4px 8px rgb(20, 20, 20),0 5px 10px rgb(51, 34, 28);

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
  box-shadow: inset 0 1px 2px rgb(95, 74, 74),0 2px 4px rgb(20, 20, 20),0 4px 8px rgb(51, 34, 28);

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
