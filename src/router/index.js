import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress';
import ShopView from '@/views/ShopView.vue';
import ProductView from '@/views/ProductView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta:{title:'Aktiv Fits'}
    },
    {
      path:'/contact',
      name:'Contact Us',
      component: ()=> import('../views/ContactView.vue'),
      meta:{title:'Contact - Aktiv Fits'}
    },
    {
      path:'/about',
      name:'About Us',
      component: ()=> import('../views/AboutView.vue'),
      meta:{title:'About - Aktiv Fits'}
    },
    {
      path:'/policy',
      name:'Privacy policy',
      component: ()=> import('../views/PolicyView.vue'),
      meta:{title:'Privacy policy - Aktiv Fits'}
    },
    {
      path:'/shop',
      name:'Shop',
      component:()=>import('../views/ShopView.vue'),
      meta:{title:'Shop - Aktiv Fits'}
    },
    {
      path:'/product/:id',
      name:'Product',
      component:()=>import('../views/ProductView.vue'),
      meta:{title:'Product - Aktiv Fits'}
    },
    {
      path:'/cart',
      name:'Cart',
      component:()=> import('../views/CartView.vue'),
      meta:{title:'Cart - Aktiv Fits'}
    },
    {
      path:'/thank-you',
      name:'Thank You',
      component: ()=>import('../views/ThankView.vue'),
    },
    {
      path:'/user/account',
      name:'Account',
      component: ()=>import('../views/AccountView.vue'),
      meta:{title:'User Account'}
    },
    {
      path:'/user/admin',
      name:'Admin',
      component: ()=>import('../views/admin/AdminHome.vue'),
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all route
      name:"Not Found",
      component:()=>import('../views/404View.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start(); // Start the progress bar on route change
  if(to.meta.title){
    document.title = to.meta.title;
  }
  else{
    document.title = 'Aktiv Fits';
  }
  next();
});

router.afterEach(() => {
  NProgress.done(); // Complete the progress bar after route change
});

export default router;
