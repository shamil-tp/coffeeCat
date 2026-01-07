<script>
import api from '@/services/api';
import { mapGetters } from 'vuex';

  export default {
    name: 'AddPost',
    data() {
      return {
        loading:false,
        imageFile: null,
        imagePreview: null,
        caption: ''
      }
    },
    computed:{
      ...mapGetters('auth',{
        user:'userDetails'
      })
    },
    methods: {
      onImageSelect(e) {
        const file = e.target.files[0]
        if (!file) return
  
        this.imageFile = file
        this.imagePreview = URL.createObjectURL(file)
      },
      async submitPost() {
        this.loading = true
        if (!this.imageFile) {
          alert('Please select an image')
          return
        }
        if (!this.user) {
      alert('User not loaded yet. Please wait or refresh.')
      return
    }
        const formData = new FormData()
        formData.append('caption',this.caption)
        formData.append('post',this.imageFile)
        let res = await api.post('/uploadpost',formData)
        console.log('Image:', this.imageFile)
        console.log('Caption:', this.caption)
        console.log('User: ',this.user)
  
        // later → API call
        this.loading = false
        this.$router.push('/')
      }
    },
    created(){
      console.log(this.user)
    }
  }
  </script>
<template>
  <div class="addpost__container">

    <!-- Header -->
    <div class="header">
      <h2>Create post</h2>
    </div>

    <!-- Image Upload -->
    <label class="image__upload">
      <input type="file" accept="image/*" hidden @change="onImageSelect" />

      <div v-if="imagePreview" class="image__preview">
        <img :src="imagePreview" alt="preview" />
      </div>

      <div v-else class="image__placeholder">
        <i class="bi bi-image"></i>
        <p>Add photo</p>
      </div>
    </label>

    <!-- Caption -->
    <textarea
      v-model="caption"
      class="caption__input"
      placeholder="write a caption..."
      maxlength="250"
    ></textarea>

    <!-- Button -->
    <button class="post__btn" @click="submitPost">

      <font-awesome-icon icon="spinner" spin v-if="loading" />
              <span v-else>Add Post</span>
    </button>

  </div>
</template>
<style scoped>
  .addpost__container {
  min-height: 100vh;
  padding: 1rem;
  padding-bottom: 90px; /* bottom nav space */
  background-color: rgb(32, 17, 6);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Header */
.header h2 {
  color: rgb(255, 222, 179);
  font-weight: 700;
  font-size: 1.4rem;
  margin: 0;
}

/* Image upload */
.image__upload {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: rgb(51, 34, 28);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

/* Placeholder */
.image__placeholder {
  text-align: center;
  color: rgb(255, 222, 179);
  opacity: 0.7;
}

.image__placeholder i {
  font-size: 2.2rem;
}

.image__placeholder p {
  margin-top: 0.3rem;
  font-size: 0.9rem;
}

/* Preview */
.image__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Caption */
.caption__input {
  width: 100%;
  min-height: 90px;
  resize: none;
  background-color: rgb(51, 34, 28);
  border: none;
  border-radius: 12px;
  padding: 0.8rem;
  color: rgb(255, 222, 179);
  font-size: 0.95rem;
  font-family: 'Inter', system-ui, sans-serif;
}

.caption__input::placeholder {
  color: #ffb78e;
  font-family: monospace;
  opacity: 0.7;
}

.caption__input:focus {
  outline: none;
}

/* Button */
.post__btn {
  /* margin-top: auto; */
  background-color: rgb(255, 222, 179);
  color: rgb(51, 34, 28);
  border: none;
  border-radius: 14px;
  padding: 0.8rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.post__btn:hover {
  transform: scale(1.02);
  background-color: #ffb78e;
}

</style>  