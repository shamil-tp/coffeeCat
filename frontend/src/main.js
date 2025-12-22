import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // optional, needed for modals, dropdowns, etc.
import 'bootstrap-icons/font/bootstrap-icons.css';

// import store from './store'import 'bootstrap-icons/font/bootstrap-icons.css';

// import './assets/main.css'

createApp(App)
  .use(router)
  .mount('#app')

  // .use(store)
  
