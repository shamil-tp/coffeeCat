import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import Profile from "@/pages/Profile.vue";
import Messages from "@/pages/Messages.vue";
import AddPost from "@/pages/AddPost.vue";
// import SearchUser from "@/components/SearchUser.vue";
import Chat from "@/components/Chat.vue";
import Comments from "@/pages/Comments.vue";
import Login from "@/pages/Login.vue";
import Signup from "@/pages/Signup.vue";
import EditProfile from "@/components/EditProfile.vue";
import ViewProfile from "@/components/ViewProfile.vue";
import AdminDashboard from "@/pages/admin/AdminDashboard.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: Profile,
        meta: { navBar: true },
      },
      {
        path: "edit-profile",
        component: EditProfile,
        meta: { navBar: false },
      },
      {
        path: "messages",
        component: Messages,
        meta: { navBar: true },
      },
      {
        path: "addpost",
        component: AddPost,
        meta: { navBar: true },
      },
      // {
      //   path: "addchat",
      //   component: SearchUser,
      //   meta: { navBar: false },
      // },
      {
        path:"view-profile/:id",
        component: ViewProfile,
        meta:{navBar:true}
      },
      
      {
        path: "comments/:id",
        component: Comments,
        meta: { navBar: false },
        props:true
      },
    ],
    meta: { navBar: true },
  },

  // 🔥 Chat page (NO bottom nav)
  {
    path: "/chat/:id",
    component: Chat,
    meta: { navBar: false },
  },
  {
    path: "/chat/user/:userId",
    component: Chat,
    meta: { navBar: false },
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: {navBar:false}
  },
  {
    path: "/auth",
    component: MainLayout,
    children: [
      { path: "/login", component: Login, meta: { navBar: false } },
      { path: "/signup", component: Signup, meta: { navBar: false } },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
