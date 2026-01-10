<script>
export default {
  name: "DeleteAlert",
  props: {
    title: {
      type: String,
      default: "Are you sure?"
    },
    message: {
      type: String,
      default: "This action cannot be undone."
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'delete']
}
</script>

<template>
  <div class="modal-wrapper">
    
    <div class="delete__overlay" @click="$emit('cancel')"></div>
  
    <div class="delete__alert--box">
      <div class="icon-circle">
        <font-awesome-icon icon="exclamation-triangle" />
      </div>

      <h3 class="delete__box--title">{{ title }}</h3>
      
      <p class="delete__box--message">
        {{ message }} <br>
        <span class="warning-text">WARNING: THIS CANNOT BE REVERSED</span>
      </p>
      
      <div class="button__container">
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        
        <button class="btn-delete" @click="$emit('delete')" :disabled="loading">
          <font-awesome-icon icon="spinner" spin v-if="loading" />
          <span v-else>Yes, Delete</span>
        </button>
      </div>
    </div>

  </div> </template>

<style scoped>
/* ... PASTE THE CSS I GAVE YOU IN THE PREVIOUS ANSWER HERE ... */
/* Add this logic for the disabled button */
/* --- OVERLAY --- */
.modal-wrapper {
  position: fixed; /* Fix to screen */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;   /* High Z-Index */
}

/* ... keep your existing CSS below ... */

/* Update .delete__overlay to be absolute relative to the wrapper */
.delete__overlay {
  position: absolute; /* Changed from fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 300; /* Behind the box */
  background-color: rgba(15, 8, 3, 0.85);
  backdrop-filter: blur(4px); 
}

/* Update .delete__alert--box z-index */


/* --- ALERT BOX CARD --- */
.delete__alert--box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;

  width: 85%;            /* Good for mobile */
  max-width: 400px;      /* Stop it getting too big on PC */
  padding: 2rem 1.5rem;  /* More breathing room */
  
  /* Theme Surface Color */
  background-color: rgb(51, 34, 28);
  
  /* Red/Orange Border to signal Danger */
  border: 2px solid #ff6b6b; 
  border-radius: 24px;
  
  /* Deep shadow to lift it up */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* --- ICON CIRCLE --- */
.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.15); /* Faint red bg */
  color: #ff6b6b; /* Red icon */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

/* --- TYPOGRAPHY --- */
.delete__box--title {
  font-family: "Lexend", sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: rgb(255, 222, 179); /* Cream Text */
  margin: 0 0 0.8rem 0;
}

.delete__box--message {
  color: #ffb78e; /* Muted Orange Text */
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.8rem 0;
}

.warning-text {
  color: #ff6b6b; /* Danger Red */
  font-weight: 700;
  font-size: 0.8rem;
  display: block;
  margin-top: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* --- BUTTONS --- */
.button__container {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.button__container button {
  flex: 1; /* Both buttons take equal width */
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Lexend", sans-serif;
  cursor: pointer;
  transition: transform 0.1s ease, opacity 0.2s;
}

.button__container button:active {
  transform: scale(0.96);
}

/* CANCEL BUTTON (Outline) */
.btn-cancel {
  background: transparent;
  border: 2px solid rgb(77, 50, 40);
  color: rgb(255, 222, 179);
}

/* DELETE BUTTON (Solid Danger) */
.btn-delete {
  background: #ff6b6b;
  border: 2px solid #ff6b6b;
  color: rgb(51, 34, 28); /* Dark text on bright button reads better */
}

.btn-delete:hover {
  background: #ff5252;
}


.btn-delete:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>