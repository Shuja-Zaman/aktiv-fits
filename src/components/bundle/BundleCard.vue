<template>
    <RouterLink :to="`/bundle/${props.id}`" class="bg-white block border border-gray-200 rounded-lg overflow-hidden shadow-md">
      <div class="relative overflow-hidden">
        <!-- Display the first image from the array -->
        <img :src="props.image" :alt="props.name" class="h-[20rem] hover:scale-105 transition-all duration-300 w-full object-cover bg-cover" />
      </div>
      <div class="p-2 flex flex-col justify-around m-2">
        <div class="my-2">
          <h3 class="text-xl capitalize kanit-medium">{{ props.name }}</h3>
          <p>Rs. {{ props.price }}</p>
        </div>
        <Button name="Buy now" />
      </div>
    </RouterLink>
  </template>
  
<script setup>
import { defineProps, computed } from 'vue';
import Button from '../button/Button.vue';
import { RouterLink } from 'vue-router';

// Define props with types
const props = defineProps({
  id: String,
  image: String,  // Expecting an array of images
  name: String,
  price: Number,
  size: String
});

  </script>

<style scoped>
/* Scoped styles are omitted since we're using Tailwind CSS classes directly */
</style>
  