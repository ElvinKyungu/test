<template>
  <section class="bg-white h-screen w-full flex items-center justify-center relative">
    <div class="py-8 px-4 lg:py-16 lg:px-6 flex justify-center">
      <div class="absolute bg-gradient-to-r from-[#9adee4] w-1/4 h-1/4 blur-3xl rounded-full z-0 top-1/2 left-1/2"></div>
      <div class="absolute bg-gradient-to-l from-[#bcf9ff] w-1/4 transform rotate-45 h-1/4 blur-3xl rounded-full z-0 top-0 left-0"></div>
      <div class="flex flex-col justify-center text-center z-50">
        <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
          Something's wrong...
        </p>
        <p class="mb-4 text-lg font-light text-gray-700 ">
          Sorry, we can't find this page. You'll find plenty to explore on the home page.
        </p>
        <router-link 
          to="/" 
          class="
            bg-[#388087]  text-gray-100 py-4 px-10  rounded-full tracking-wide
            font-semibold font-display focus:outline-none focus:shadow-outline 
            hover:bg-[#295f64] shadow-lg m-auto
          "
        >
          Back to home page
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </section>
</template>
<script setup lang="ts">
</script>