<script>
  import BottomNav from '@/components/BottomNav.vue'
import { mapActions, mapGetters } from 'vuex';

  
  export default {
    components: { BottomNav },
    methods:{
      ...mapActions('auth',['fetchUser','logout'])
    },
    created(){
      this.fetchUser()
    }
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
