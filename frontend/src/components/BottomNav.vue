<script>
import { mapGetters } from 'vuex';


  export default{
    name:'BottomNav',
    // data(){
    //   return {
    //     isDark:true
    //   }
    // },
    // methods:{
    //   toggleTheme(){
    //     this.isDark =  !this.isDark
    //   }
    // },
    computed:{
      ...mapGetters('auth',{
        user:'userDetails'
      })
    }
  }
</script>
<template>
  <div class="bottom__navbar--container">
    
    <!-- Left -->
    <router-link to="/messages" class="nav-link" v-slot="{ isActive }">
  <font-awesome-icon
    :icon="isActive ? ['fas', 'paper-plane'] : ['fas', 'location-arrow']"
  />
</router-link>



    <!-- Floating Center Button -->
    <router-link
  :to="$route.path === '/addpost' ? '/' : '/addpost'"
  class="floating-btn"
>
  <font-awesome-icon
    :icon="['fas', 'plus']"
    size="lg"
    class="plus-icon"
    :class="{ active: $route.path === '/addpost' }"
  />
</router-link>



    <!-- Right -->
    <router-link to="/" class="nav-link" v-slot="{ isActive }">
  <div
    v-if="user"
    class="avatar"
    :class="{ active: isActive }"
  >
    <img :src="user.avatar" alt="profile" />
  </div>

  <i v-else class="bi bi-person-circle"></i>
</router-link>

<!-- <div class="nav-link">
  <i
  class="bi"
  :class="isDark ? 'bi-sun' : 'bi-moon'"
  @click="toggleTheme"
></i>
</div> -->


  </div>
</template>

<style scoped>
 .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 2px;
  transition: background-color 0.3s ease;
}

.avatar.active {
  background-color: rgb(78, 36, 36);
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

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
.nav-link i, .nav-link svg{
  font-size: 2.3rem;
  color: rgb(255, 222, 179);
  display: inline-block;
  transition: transform 0.35s ease, color 0.35s ease;
}

/* Remove blue underline */
:deep(a){
  text-decoration: none;
}
/* ACTIVE ICON ANIMATION */
:deep(.router-link-active) i{
  color: #ffdbc7;
  transform: scale(.9) translateY(0px);
}
.nav-link i {
  transition: transform 0.35s ease, color 0.35s ease;
}

.nav-link svg {
  transition: transform 0.35s ease, color 0.35s ease;

}
:deep(.router-link-active) svg{
  color: #ffdbc7;
  transform: rotate(45deg);
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
  /* transform: translateY(-70%); */
}

.floating-btn svg {
  font-size: 2rem;
  color: rgb(51, 34, 28);
}

/* Hover animation */
.floating-btn:hover {
  transform: scale(1.1);
  background-color: burlywood;
}
.plus-icon {
  transition: transform 0.45s cubic-bezier(.34,1.56,.64,1);
}


.plus-icon.active {
  transform: rotate(45deg) scale(1.05);
}





</style>