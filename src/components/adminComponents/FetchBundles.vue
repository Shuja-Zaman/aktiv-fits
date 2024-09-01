<template>
    <div class="p-5 bg-slate-300">
      <h2 class="text-2xl font-bold mb-4">Bundles</h2>
      
      <!-- Display bundles -->
      <div v-if="bundles.length">
        <div 
          v-for="bundle in bundles" 
          :key="bundle.id" 
          class="p-4 bg-white shadow-md rounded-md mb-4"
        >
          <h3 class="text-lg font-semibold">{{ bundle.name }}</h3>
          <p class="text-gray-700">{{ bundle.description }}</p>
          <p class="text-gray-900 font-bold">Rs. {{ bundle.price.toFixed(2) }}</p>
          <img :src="bundle.image" alt="Bundle Image" class="w-full h-48 object-cover mt-2 rounded-md" />
          <ul class="mt-2">
            <!-- Display product names instead of IDs -->
            <li v-for="product in bundle.productDetails" :key="product.id">
              {{ product.name }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Show message if no bundles are available -->
      <div v-else>
        <p>No bundles available.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
  import { db } from '@/firebase/firebase.js';
  
  const bundles = ref([]);
  
  // Function to fetch bundles from Firebase Firestore
  const fetchBundles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'bundles'));
      const bundlesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Fetch product details for each bundle
      for (const bundle of bundlesData) {
        bundle.productDetails = [];
        for (const productId of bundle.products) {
          const productDoc = await getDoc(doc(db, 'products', productId));
          if (productDoc.exists()) {
            bundle.productDetails.push({ id: productId, ...productDoc.data() });
          }
        }
      }
  
      bundles.value = bundlesData;
    } catch (err) {
      console.error('Error fetching bundles:', err);
    }
  };
  
  // Fetch bundles when the component is mounted
  onMounted(() => {
    fetchBundles();
  });
  </script>
  
  <style scoped>
  /* Add any required styling */
  .p-5 {
    padding: 20px;
  }
  .bg-white {
    background-color: white;
  }
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .object-cover {
    object-fit: cover;
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  </style>
  