import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import Profile from '@/pages/Profile.vue'
import Messages from '@/pages/Messages.vue'
import AddPost from '@/pages/AddPost.vue'
import Chat from '@/components/Chat.vue'
import Comments from '@/pages/Comments.vue'
import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'profile',
        component: Profile,
        meta:{navBar:true},

      },
      {
        path: 'messages',
        component: Messages,
        meta:{navBar:true},

      },
      {
        path: 'addpost',
        component: AddPost,
        meta:{navBar:true},

      },
      {
        path:'comments/:id',
        component:Comments,
        meta:{navBar:false}
      }
    ],
    meta:{navBar:true}
  },

  // 🔥 Chat page (NO bottom nav)
  {
    path: '/chat/:id',
    component: Chat,
    meta:{navBar:false}
  },
  {
    path:'/auth',
    Component:MainLayout,
    children:[
      {path:'/login',component:Login,meta:{navBar:false}},
      {path:'/signup',component:Signup,meta:{navBar:false}}
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
