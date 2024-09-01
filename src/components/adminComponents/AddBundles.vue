<template>
    <div class="bg-gray-100 p-5 mt-3">
      <h2>Create a Bundle</h2>
      <form @submit.prevent="createBundle">
        <!-- Bundle Name -->
        <div>
          <label for="bundleName">Bundle Name:</label>
          <input v-model="bundle.name" type="text" id="bundleName" required />
        </div>
  
        <!-- Bundle Price -->
        <div>
          <label for="bundlePrice">Bundle Price:</label>
          <input v-model="bundle.price" type="number" id="bundlePrice" step="0.01" required />
        </div>
  
        <!-- Bundle Description -->
        <div>
          <label for="bundleDescription">Description:</label>
          <textarea v-model="bundle.description" id="bundleDescription" required></textarea>
        </div>
  
        <!-- Bundle Image -->
        <div class="space-y-2">
          <label for="image" class="block text-md kanit-medium text-gray-700">Product Image</label>
          <input
            @change="handleImageUpload"
            id="image"
            type="file"
            class="block kanit-thin w-full px-3 py-2 border border-zinc-400 rounded-md shadow-sm focus:border-zinc-600 focus:outline-none"
            accept="image/*"
          />
        </div>
  
        <!-- Product Selection -->
        <div>
          <h3>Select Products for the Bundle:</h3>
          <ul>
            <li v-for="product in products" :key="product.id">
              <label>
                <input type="checkbox" :value="product.id" v-model="selectedProducts" />
                {{ product.name }}
              </label>
            </li>
          </ul>
        </div>
  
        <!-- Error Message -->
        <div v-if="error">{{ error }}</div>
  
        <!-- Loading Indicator -->
        <div v-if="loading" class="text-center text-gray-500">Adding Bundle...</div>
  
        <!-- Submit Button -->
        <button type="submit" class="bg-black text-white" :disabled="loading">Create Bundle</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { collection, getDocs, addDoc } from 'firebase/firestore';
  import { db } from '@/firebase/firebase.js';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  const products = ref([]);
  const selectedProducts = ref([]);
  const error = ref('');
  const loading = ref(false);
  const bundle = ref({
    name: '',
    price: 0,
    description: '',
    image: '', // We'll use this to store the image URL
  });
  
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      error.value = err.message;
    }
  };
  
  const imageFile = ref(null);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      imageFile.value = file;
    }
  };
  
  const uploadImage = async () => {
    const storage = getStorage();
    const imageRef = storageRef(storage, `bundle/${imageFile.value.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile.value);
    return await getDownloadURL(snapshot.ref);
  };
  
  const createBundle = async () => {
    if (selectedProducts.value.length === 0) {
      error.value = 'Please select at least one product for the bundle.';
      return;
    }
  
    if (!imageFile.value) {
      error.value = 'Please upload an image for the bundle.';
      return;
    }
  
    loading.value = true;
    error.value = '';
  
    try {
      const imageUrl = await uploadImage();
  
      const newBundle = {
        name: bundle.value.name,
        price: bundle.value.price,
        description: bundle.value.description,
        image: imageUrl,
        products: selectedProducts.value, // List of selected product IDs
        availability: true,
      };
  
      await addDoc(collection(db, 'bundles'), newBundle);
      alert('Bundle created successfully!');
      // Reset form
      bundle.value = {
        name: '',
        price: 0,
        description: '',
        image: '',
      };
      selectedProducts.value = [];
      imageFile.value = null; // Reset image file
    } catch (err) {
      error.value = 'Error creating bundle: ' + err.message;
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    fetchProducts();
  });
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  label {
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="number"],
  textarea {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin: 0.5rem 0;
  }
  </style>
  