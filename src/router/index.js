import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta:{title:'Aktiv Fits',
        description: 'Welcome to Aktiv Fits - Your ultimate destination for premium Aktiv wear. Explore our latest collections and get ready to elevate your fitness style.'      }
    },
    {
      path:'/contact',
      name:'Contact Us',
      component: ()=> import('../views/ContactView.vue'),
      meta:{title:'Contact - Aktiv Fits', description: 'Have questions or need support? Reach out to the Aktiv Fits team through our contact page. We are here to assist you with all your queries.'
      }
    },
    {
      path:'/about',
      name:'About Us',
      component: ()=> import('../views/AboutView.vue'),
      meta:{title:'About - Aktiv Fits', description: 'Learn more about Aktiv Fits - Our mission, values, and commitment to providing high-quality Aktiv wear designed to inspire and empower your fitness journey.'
      }
    },
    {
      path:'/policy',
      name:'Privacy policy',
      component: ()=> import('../views/PolicyView.vue'),
      meta:{title:'Privacy policy - Aktiv Fits', description: 'Review Aktiv Fits\' privacy policy to understand how we handle your personal information with care and respect for your privacy.'
      }
    },
    {
      path:'/shop',
      name:'Shop',
      component:()=>import('../views/ShopView.vue'),
      meta:{title:'Shop - Aktiv Fits',  description: 'Browse our wide selection of Aktiv wear, including shirts, t-shirts, trousers, and shorts. Find the perfect gear to enhance your workouts and style.'
      }
    },
    {
      path:'/product/:id',
      name:'Product',
      component:()=>import('../views/ProductView.vue'),
      meta:{title:'Product - Aktiv Fits',  description: 'Discover detailed information about our premium Aktiv wear. View high-quality images, product specifications, and customer reviews before making your purchase.'
      }
    },
    {
      path:'/bundle/:id',
      name:'Bundle',
      component:()=>import('../views/BundleView.vue'),
      meta:{title:'Bundles - Aktiv Fits',  description: 'Discover detailed information about our special offers. View high-quality images, product specifications, and customer reviews before making your purchase.'
      }
    },
    {
      path:'/cart',
      name:'Cart',
      component:()=> import('../views/CartView.vue'),
      meta:{title:'Cart - Aktiv Fits',  description: 'Review the Aktiv wear you’ve added to your cart. Make adjustments, and proceed to checkout with ease.'
      }
    },
    {
      path:'/thank-you',
      name:'Thank You',
      component: ()=>import('../views/ThankView.vue'),
      description: 'Thank you for your purchase! We appreciate your support and look forward to seeing you again at Aktiv Fits.'
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
