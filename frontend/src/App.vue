<script>
  import BottomNav from '@/components/BottomNav.vue'
  
  export default {
    components: { BottomNav }
  }
  </script>
  
<template>
  <router-view />
  <BottomNav v-if="$route.meta.navBar"/>
</template>
<style scoped>
  template{
    /* overflow-y: hidden; */
    /* overflow-x: hidden; */
    width: 100%;
    height: 100vh;
  }
</style>
<!-- 
<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <router-view />
  </div>
</template> -->
