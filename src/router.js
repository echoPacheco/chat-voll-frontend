import Vue from 'vue';
import Router from 'vue-router';
import { getTokenFromCookies } from '@/helpers/auth'

import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import ConversationPage from '@/views/ConversationPage.vue';

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
    {
      path: '/conversation/:id',
      name: 'Conversation',
      props: true,
      meta: { requiresAuth: true },
      component: ConversationPage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getTokenFromCookies();

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});


export default router;