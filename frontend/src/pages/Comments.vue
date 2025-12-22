<script>
    export default {
      name: 'Comments',
      props: ['id'],
      data() {
        return {
          commentText: '',
          comments: [] // later from backend
        }
      },
      methods: {
        goBack() {
          this.$router.back()
        },
        addComment() {
          if (!this.commentText.trim()) return
    
          this.comments.push({
            id: Date.now(),
            text: this.commentText
          })
    
          this.commentText = ''
        }
      }
    }
    </script>
    
    <template>
      <div class="comments-page">
    
        <!-- HEADER -->
        <div class="comments-header">
          <i class="bi bi-arrow-left" @click="goBack"></i>
          <p>Comments</p>
          <span></span>
        </div>
    
        <!-- COMMENTS LIST -->
        <div v-if="comments.length === 0" class="empty-comments">
          <h3>No comments yet.</h3>
          <p>Start the conversation.</p>
        </div>
    
        <!-- INPUT -->
        <div class="comment-input">
          <img
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=user`"
          />
    
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
    /* PAGE */
    .comments-page {
      background: rgb(32, 17, 6);
      min-height: 100vh;
      color: rgb(255, 222, 179);
      padding-bottom: 90px;
    }
    
    /* HEADER */
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
    
    /* EMPTY STATE */
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
    
    /* INPUT BAR */
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
    }
    
    .comment-input input {
      flex: 1;
      background: rgb(51, 34, 28);
      border: none;
      border-radius: 999px;
      padding: 0.6rem 1rem;
      color: rgb(255, 222, 179);
      outline: none;
    }
    
    .comment-input input::placeholder {
      color: #ffb78e;
      opacity: 0.7;
    }
    
    /* SEND ICON */
    .send {
      font-size: 1.3rem;
      color: #ffb78e;
      cursor: pointer;
      transform: rotate(45deg);
    }
    </style>
    