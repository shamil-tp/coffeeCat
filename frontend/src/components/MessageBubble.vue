<script>
export default {
  name: 'MessageBubble',
  props: {
    msg: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    },
    peopleCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    isMine() {
      return this.msg.sender._id === this.currentUser._id;
    },
    formattedTime() {
      const date = new Date(this.msg.createdAt);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
    isRead() {
      return this.msg.seen || (this.peopleCount > 1);
    },
    // Safe access to avatar in case sender object is missing
    senderAvatar() {
      return this.msg.sender?.avatar || 'https://via.placeholder.com/40';
    }
  }
}
</script>
<template>
  <div class="bubble-wrapper" :class="{ 'my-message': isMine }">

    <!-- AVATAR (Only for received messages) -->
    <div v-if="!isMine" class="avatar">
      <img :src="msg.sender.avatar || 'https://i.pravatar.cc/40'" />
    </div>

    <div class="bubble" :class="isMine ? 'sent' : 'received'">

      <img
        v-if="msg.image"
        :src="msg.image"
        class="bubble-image"
      />

      <p class="message-text">{{ msg.content || msg.text }}</p>

      <div class="meta-info">
        <span class="time">{{ formattedTime }}</span>

        <span v-if="isMine" class="receipt">
          <i
            class="bi"
            :class="isRead ? 'bi-check-all read-color' : 'bi-check sent-color'"
          ></i>
        </span>
      </div>

    </div>

  </div>
</template>
<style>
.bubble-wrapper {
  display: flex;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 0.6rem;
  gap: 0.4rem;
}

.my-message {
  justify-content: flex-end;
}

/* AVATAR */
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* MESSAGE BUBBLE */
.bubble {
  max-width: 70%;
  min-width: 80px;
  padding: 0.55rem 0.8rem;
  border-radius: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* IMAGE MESSAGE */
.bubble-image {
  max-width: 100%;
  border-radius: 12px;
  margin-bottom: 6px;
}

/* MESSAGE TEXT */
.message-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word;
}

/* META INFO */
.meta-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 2px;
}

/* TIME */
.time {
  font-size: 0.65rem;
  opacity: 0.75;
  font-weight: 500;
}

/* READ RECEIPT */
.receipt i {
  font-size: 1rem;
}

.read-color {
  color: #017fd3;
}

.sent-color {
  color: rgba(51, 34, 28, 0.6);
}

/* SENT MESSAGE */
.sent {
  background: linear-gradient(
    135deg,
    #ffd2b2,
    #ffb78e
  );
  color: rgb(51, 34, 28);
  border-bottom-right-radius: 4px;

  box-shadow:
    2px 4px 10px rgba(255, 183, 142, 0.35),
    0 2px 6px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}


/* RECEIVED MESSAGE */
.received {
  background: linear-gradient(
    135deg,
    rgb(62, 42, 34),
    rgb(51, 34, 28)
  );
  color: rgb(255, 222, 179);
  border-bottom-left-radius: 4px;

  box-shadow:
    -2px 4px 12px rgba(0, 0, 0, 0.55),
    0 1px 4px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 222, 179, 0.08);
}


/* RECEIVED TIME COLOR */
.received .time {
  color: rgba(255, 222, 179, 0.6);
}


</style>