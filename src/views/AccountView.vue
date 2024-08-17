<template>
  <div class="account-page p-6 max-w-4xl mx-auto h-screen">
    <div class="header mb-6">
      <h1 class="text-3xl font-bold text-gray-800">My Account</h1>
      <p class="text-gray-600">Welcome, <span class="kanit-medium">{{ currentUser }}</span></p>
    </div>

    <div class="orders-section">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">My Orders</h2>

      <div v-if="loading" class="loading-spinner">
        <p>Loading...</p> <!-- You can replace this with a more stylish spinner -->
      </div>

      <div v-else>
        <div v-if="orders.length === 0" class="no-orders text-gray-500">
          <p>You have no orders yet.</p>
          <RouterLink to="/shop">
            <Button name="Shop Now" class="my-2"/>
          </RouterLink>
        </div>
        <div v-else class="orders-list space-y-4">
          <div v-for="order in orders" :key="order.id" class="bg-slate-100 order-card shadow-md rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800">Order: #{{ order.id }}</h3>
            <p class="text-gray-600">Date: {{ formatDate(order.timestamp) }}</p>
            <p class="text-gray-600">Total: Rs. {{ order.totalAmount }}</p>
            <div class="items mt-2">
              <h4 class="font-medium text-gray-700">Items:</h4>
              <ul class="list-disc ml-5">
                <li v-for="item in order.items" :key="item.id" class="text-gray-600">
                  {{ item.name }} (x{{ item.quantity }})
                  <span v-if="item.size" class="text-gray-500">({{ item.size }})</span>
                </li>
              </ul>
            </div>
            <hr class="my-4"/>
            <h1>Status: <span class="capitalize text-lime-600">{{ order.status }}</span></h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Button from '@/components/button/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = localStorage.getItem('email');
const orders = ref([]);
const currentUser = email;
const loading = ref(true); // Track loading state

const formatDate = (timestamp) => {
  if (timestamp && timestamp.seconds !== undefined) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  } else {
    return 'Unknown Date';
  }
};

const fetchOrders = async () => {
  try {
    if (!email) return;
    const ordersQuery = query(collection(db, 'orders'), where('email', '==', email));
    const querySnapshot = await getDocs(ordersQuery);
    
    orders.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false; // Stop loading once data is fetched
  }
};

const checkAuth = () => {
  if (!email) {
    router.push('/');
  }
};

onMounted(() => {
  checkAuth();
  fetchOrders();
});
</script>

<style scoped>
.account-page {
  background-color: #f9f9f9;
}

.header {
  border-bottom: 1px solid #e2e8f0;
}

.orders-section {
  background-color: #ffffff;
  border-radius: 0.375rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.order-card {
  padding: 1.25rem;
}

.no-orders {
  padding: 1rem;
  text-align: center;
  font-size: 1.125rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* Adjust as needed */
  font-size: 1.25rem;
}
</style>
