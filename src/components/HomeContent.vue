<script setup lang="ts">
  import Aside from './Aside.vue'
  import Map from './Map.vue'
  import { onMounted } from 'vue'
  import { initializeMap } from '../google-map/googlemaploader'
  // import { useUserDataStore } from '../stores/userStore'
  import { useUserStore } from '../stores/store'

  const userStore = useUserStore()
  // const userDataStore = useUserDataStore()
  onMounted(async () => {
    // if(userStore.getUserInfo.userID){
    //   await userDataStore.fetchUserDevices(userStore.getUserInfo.userID)
    // }
    await initializeMap()
  })
</script>
<template>
  <div class="relative h-screen">
    <main class="fixed flex h-[100vh] z-30">
      <Aside />
      <Map />
    </main>
  </div>
</template>
<style>
  main {
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    position: relative;
  }
</style>
