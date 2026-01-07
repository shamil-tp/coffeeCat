<script>
import api from '@/services/api';
import { mapGetters } from 'vuex';

export default {
  name: 'Comments',
  props: ['id'], // Post ID passed from router
  data() {
    return {
      commentText: '',
      comments: [] 
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // Fetch comments
    async fetchComments() {
      try {
        const res = await api.get(`/get-comments/${this.id}`);
        this.comments = res.data.comments;
      } catch (e) {
        console.log(e);
      }
    },
    // Add comment
    async addComment() {
      if (!this.commentText.trim()) return;

      try {
        const res = await api.post(`/add-comment/${this.id}`, {
          text: this.commentText,
          userId: this.user._id
        });

        // Add to list immediately
        this.comments.unshift(res.data.comment);
        this.commentText = ''; 

      } catch (e) {
        console.log("Error adding comment", e);
      }
    }
  },
  computed: {
    ...mapGetters('auth', {
      user: "userDetails"
    })
  },
  created() {
    this.fetchComments();
    console.log(this.id)
  }
}
</script>

<template>
  <div class="comments-page">

    <div class="comments-header">
      <i class="bi bi-arrow-left" @click="goBack"></i>
      <p>Comments</p>
      <span></span>
    </div>

    <div v-if="comments.length === 0" class="empty-comments">
      <h3>No comments yet.</h3>
      <p>Start the conversation.</p>
    </div>

    <div v-else class="comments-list-container">
        <div v-for="comment in comments" :key="comment._id" class="single-comment">
            <div class="comment-left">
                <img :src="comment.user.avatar" alt="">
            </div>
            <div class="comment-right">
                <span class="username">{{ comment.user.username }}</span>
                <p class="comment-text">{{ comment.text }}</p>
            </div>
        </div>
    </div>

    <div class="comment-input" v-if="user">
      <img :src="user.avatar" />

      <input
        type="text"
        placeholder="Add a comment..."
        v-model="commentText"
        @keyup.enter="addComment"
      />

      <i
        v-if="commentText.length"
        class="bi bi-send-fill send"
        @click="addComment"
      ></i>
    </div>

  </div>
</template>

<style scoped>
/* PAGE - Your Original Style */
.comments-page {
  background: rgb(32, 17, 6);
  min-height: 100vh;
  color: rgb(255, 222, 179);
  padding-bottom: 90px;
}

/* HEADER - Your Original Style */
.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgb(51, 34, 28);
}

.comments-header i {
  font-size: 1.5rem;
  cursor: pointer;
}

/* EMPTY STATE - Your Original Style */
.empty-comments {
  text-align: center;
  margin-top: 40%;
}

.empty-comments h3 {
  font-weight: 600;
}

.empty-comments p {
  opacity: 0.7;
}

/* COMMENTS LIST - Minimal styling to fit your theme */
.comments-list-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.single-comment {
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.comment-left img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ffb78e;
}

.comment-right {
    display: flex;
    flex-direction: column;
}

.comment-right .username {
    font-weight: 700;
    font-size: 0.9rem;
    color: #ffb78e;
}

.comment-right .comment-text {
    margin: 0;
    font-size: 0.95rem;
    color: rgb(255, 222, 179);
    word-break: break-word; /* Prevents long words breaking layout */
}

/* INPUT BAR - Your Original Style */
.comment-input {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.7rem 1rem;
  background: rgb(32, 17, 6);
  border-top: 1px solid rgb(51, 34, 28);
}

.comment-input img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input input {
  flex: 1;
  background: rgb(51, 34, 28);
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  color: rgb(255, 222, 179);
  outline: none;
  border: 2px dashed #ffb78e
}

.comment-input input::placeholder {
  color: #ffb78e;
  opacity: 0.8;
}

/* SEND ICON - Your Original Style */
.send {
  font-size: 1.3rem;
  color: #ffb78e;
  cursor: pointer;
  transform: rotate(45deg);
}
</style>