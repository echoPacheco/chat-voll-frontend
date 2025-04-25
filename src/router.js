import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
// import Conversation from '@/views/Conversation.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      meta: { requiresAuth: true }, 
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
    },
    // {
    //   path: '/conversation/:id',
    //   name: 'Conversation',
    //   component: Conversation,
    //   props: true,
    //   meta: { requiresAuth: true },
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;