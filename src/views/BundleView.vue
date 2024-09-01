<template>
    <div class="min-h-screen bg-gray-100 p-5">
      <!-- Loading Spinner -->
      <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
        <div class="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-zinc-700 rounded-full animate-spin"></div>
      </div>
  
      <!-- Bundle Content -->
      <div v-if="!loading && bundle" class="container mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <!-- Bundle Header -->
        <div class="p-6 bg-neutral-800 text-neutral-100">
          <h1 class="mb-2 kanit-medium text-3xl">{{ bundle.name }}</h1>
          <p class="text-lg capitalize">{{ bundle.description }}</p>
          <h2 class="line-through text-lg text-gray-400 ">Rs. {{ originalPrice }}</h2>
          <h1 class="mb-2 text-2xl text-orange-400">Rs. {{ bundle.price }}</h1>
        </div>
  
        <!-- Products Section -->
        <div class="p-2">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Product Cards -->
            <div v-for="(product, index) in Products" :key="index" class="bg-white shadow-md rounded-lg p-4">
              <img :src="product.imageUrls[0]" :alt="product.name" class="border w-full h-[20rem] object-cover rounded-md mb-4 bg-cover" />
              <h2 class="text-2xl kanit-medium">{{ product.name }}</h2>
              <!-- Size Selector -->
              <div v-if="product.sizes.length" class="flex items-center gap-5 mt-2">
                <p class="mb-2">Size:</p>
                <div class="flex gap-4">
                  <label v-for="size in product.sizes" :key="size" class="flex items-center gap-2">
                    <input type="radio" v-model="product.selectedSize" :value="size" class="form-radio h-5 w-5" />
                    <span class="border-[1px] py-1 px-2 rounded-sm bg-zinc-200">{{ size }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Bundle Actions -->
        <div class="p-6 bg-slate-50 flex flex-col gap-5 justify-between items-center">
          <!-- Quantity Selector -->
          <div class="flex items-center gap-5 mb-4 md:mb-0">
            <label class="text-lg w-full">Quantity:</label>
            <input
              type="number"
              v-model="quantity"
              min="1"
              class="border border-zinc-300 rounded-md p-2 md:w-20 sm:w-10 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <!-- Message Display -->
          <p v-if="message" class="text-red-500 kanit-thin">{{ message }}</p>
          <!-- Add to Cart Button -->
          <Button @click="addToCart" name="Add to Cart" />
        </div>
      </div>

      <img  src="../assets/images/t-shirt.png" alt="Chart" class="lg:w-[75%] mx-auto my-10">
      <img  src="../assets/images/trouser.png" alt="Chart" class="lg:w-[75%] mx-auto my-10">

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { getDoc, doc } from 'firebase/firestore';
  import { db } from '@/firebase/firebase'; // Adjust the import path as needed
  import Button from '@/components/button/Button.vue';
  import { useCartStore } from '@/store/cart.js';
  
  const route = useRoute();
  const bundleId = ref(route.params.id); // Use ref to track dynamic changes
  const bundle = ref(null);
  const loading = ref(true); // Loading state
  const quantity = ref(1); // Initialize quantity to 1
  const originalPrice = ref(1); // Initialize quantity to 1
  const cartStore = useCartStore();
  const Products = ref([]); // Array to hold product details
  const message = ref('');

  // Validate Quantity
  const validateQuantity = () => {
    const value = quantity.value;
    if (isNaN(value) || value === '') {
      message.value = 'Please enter a valid number.';
      return false;
    }
    if (value < 1 || value > 10) {
      message.value = 'Quantity must be between 1 and 10.';
      return false;
    }
    message.value = '';
    return true;
  };
  
  // Fetch bundle details including products
  const fetchBundles = async () => {
    try {
      loading.value = true; // Set loading to true before fetching
      const docRef = doc(db, 'bundles', bundleId.value);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        bundle.value = docSnap.data();
        Products.value = [];
  
        // Fetch each product details and add to Products array
        for (const productId of bundle.value.products) {
          const productRef = doc(db, 'products', productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const productData = productSnap.data();
            productData.sizes = productData.size ? productData.size.split(',').map(s => s.trim()) : []; // Parse sizes
            productData.selectedSize = ''; // Initialize selected size
            Products.value.push(productData);
            originalPrice.value += productData.price;
          }
        }
      } else {
        console.error('No such document!');
        message.value = 'Bundle not found.';
      }
    } catch (err) {
      console.error('Error fetching bundle:', err);
      message.value = 'Failed to load bundle details. Please try again later.';
    } finally {
      loading.value = false; // Ensure loading is set to false after fetching
    }
  };
  
  // Add bundle to cart
  const addToCart = () => {
    if (!validateQuantity()) return;
  
    // Check if each product has a selected size
    for (const product of Products.value) {
      if (product.sizes.length && !product.selectedSize) {
        message.value = `Please select a size for ${product.name}.`;
        return;
      }
    }
  
    const bundleToAdd = {
      id: bundleId.value,
      name: bundle.value.name,
      price:bundle.value.price,
      image:bundle.value.image,
      products: Products.value.map(product => ({
        name:product.name,
        selectedSize: product.selectedSize // Include selected size
      })),
      quantity: quantity.value,
    };
  
    cartStore.addProduct(bundleToAdd);
    alert("Bundle added to Cart.");
  };
  
  // Fetch bundle details when component is mounted
  onMounted(() => {
    fetchBundles();
  });
  
  // Watch for route changes to refetch bundles
  watch(() => route.params.id, (newId) => {
    bundleId.value = newId;
    fetchBundles();
  });
  </script>
  