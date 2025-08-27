<script lang="ts" setup>
import SignInPassword from '../components/form/SignInPassword.vue'
// import SigninMagicLink from '../components/form/SigninMagicLink.vue'
</script>
<template>
  <div class="w-full">
    <div class="lg:flex relative bg-white min-h-screen">
      <div class="bg-white lg:max-w-1/2 z-50 relative xl:max-w-screen-sm min-h-screen overflow-y-auto rounded-t-[5rem]">
        <div 
          class="
            p-12 image_bg_smallScreenAuth lg:bg-white relative
            w-full 
          "
        >
          <div class="hidden lg:flex items-center w-full justify-between">
            <div>
              <img src="../assets/icono_service.svg" class="w-24 h-16 object-contain" alt="">
            </div>
            <div class="flex items-center gap-2">
              <p>Powered by</p>
              <img src="../assets/logo-icon.svg" class="w-12" alt="">
            </div>
          </div>
        </div>
        <div 
          class="
            px-10 py-10 lg:py-0 rounded-t-[3rem] sm:px-24 md:px-48 lg:px-12 -mt-10
            lg:-mt-10 xl:px-24 xl:max-w-2xl bg-white 
          "
        >
          <div>
            <SignInPassword />
          </div>
          <div class="mt-10 px-4 lg:px-0">
            <div class="flex justify-center items-center gap-6 flex-wrap">
              <img src="../assets/ICONOMEDIA_S2.svg" class="h-14 object-contain" alt="Icono Media" />
              <img src="../assets/iconogreen-logo-new.svg" class="h-14 object-contain" alt="Icono Green" />
            </div>
            <div class="flex items-center justify-center my-6">
              <div class="flex-1 h-px bg-gray-300"></div>
              <p class="mx-4 text-sm text-gray-600">In partnership with</p>
              <div class="flex-1 h-px bg-gray-300"></div>
            </div>
            <div class="flex justify-center">
              <img src="../assets/strategic_logo_text.svg" class="h-10 object-contain" alt="Strategic Zone" />
            </div>
          </div>
        </div>
      </div>
      <div 
        class="
          hidden md:relative lg:flex items-center justify-center bg-[#C2EDCE] 
          flex-1
        "
      >
        <div class="absolute  w-full h-full">
          <img src="../assets/bg_auth.jpg" class="w-full h-full object-cover" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<style>
@media screen and (max-width: 768px) {
  .image_bg_smallScreenAuth {
    background-image: url(../assets/bg_auth.png);
    background-position: center;
  }
}
</style>