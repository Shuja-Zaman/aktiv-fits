<template>
    <div class="bg-white p-4 rounded shadow-md flex flex-col items-start kanit-thin sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col md:flex-row md:items-center justify-start gap-4">
        <img :src="item.imgUrl || item.image" :alt="item.name" class="w-full  h-[18rem] object-cover rounded self-center sm:self-start" />
        <div>
          <h2 class="text-2xl kanit-extrabold">{{ item.name }}</h2>
          <p v-if="item.size"><span class="kanit-medium">Size:</span> {{ item.size }}</p>
          <p class="" v-for="item in bundleProducts" :key="item.id">
            {{ item.name }} ({{ item.selectedSize }})
          </p>
          <p><span class="kanit-medium">Quantity:</span> {{ item.quantity }}</p>
          <p><span class="kanit-medium">Per:</span> Rs. {{ item.price }}</p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2 sm:gap-4">
        <p class="text-xl font-bold mt-4 sm:mt-0">Rs. {{ item.price * item.quantity }}</p>
        <button @click="removeFromCart" class="p-2  rounded-md text-white kanit-thin bg-red-500 hover:bg-red-700 font-bold">
          Remove
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from '@/store/cart.js';
  import { computed, toRefs } from 'vue';
  
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  });
  
  // Use destructuring to access the item directly
  const { item } = toRefs(props);

  const bundleProducts = item.value.products;

  const cartStore = useCartStore();

  const removeFromCart = ()=>{
    cartStore.removeProduct(item.value.id, item.value.size);
  }
  
  </script>
  
  <style scoped>
  /* Scoped styles for CartCard */
  </style>
  