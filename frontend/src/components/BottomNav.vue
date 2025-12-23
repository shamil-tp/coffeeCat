<script>
  export default{
    name:'BottomNav'
  }
</script>
<template>
  <div class="bottom__navbar--container">
    
    <!-- Left -->
    <router-link to="/messages" class="nav-link">
      <i class="bi bi-send"></i>
    </router-link>

    <!-- Floating Center Button -->
    <router-link to="/addpost" class="floating-btn">
      <i class="bi bi-plus-lg"></i>
    </router-link>

    <!-- Right -->
    <router-link to="/" class="nav-link">
      <i class="bi bi-person-circle"></i>
    </router-link>

  </div>
</template>

<style scoped>
 /* .bottom__navbar--container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background-color: rgb(51, 34, 28);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
} */
.bottom__navbar--container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  height: 70px;
  padding-bottom: env(safe-area-inset-bottom);

  background-color: rgb(51, 34, 28);
  display: flex;
  justify-content: space-around;
  align-items: center;

  z-index: 100;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

/* Icons */
.nav-link i {
  font-size: 2.3rem;
  color: rgb(255, 222, 179);
  display: inline-block;
  transition: transform 0.25s ease, color 0.25s ease;
}

/* Remove blue underline */
:deep(a) {
  text-decoration: none;
}

/* ACTIVE ICON ANIMATION */
:deep(.router-link-active) i {
  color: #ffdbc7;
  transform: scale(.9) translateY(0px);
}
.nav-link i {
  transition: transform 0.25s ease, color 0.25s ease;
}



/* Floating + button */
.floating-btn {
  /* position: absolute;
  top: -28px; */
  width: 48px;
  height: 48px;
  background-color: rgb(255, 222, 179);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: transform 0.25s ease;
}

.floating-btn i {
  font-size: 2rem;
  color: rgb(51, 34, 28);
}

/* Hover animation */
.floating-btn:hover {
  transform: scale(1.1) rotate(90deg);
  background-color: burlywood;
}



</style>