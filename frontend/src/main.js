import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // optional, needed for modals, dropdowns, etc.
import 'bootstrap-icons/font/bootstrap-icons.css';

    /* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas, far, fab)

// import store from './store'import 'bootstrap-icons/font/bootstrap-icons.css';

// import './assets/main.css'

createApp(App)
  .use(store)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')

  // .use(store)
  
