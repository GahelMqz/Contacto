<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8 relative">
        <div class="text-9xl font-bold text-[#2563EB] animate-spin">😵</div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <h1 class="text-4xl font-bold text-gray-800 mb-4">Oops! Página no encontrada</h1>

      <p class="text-xl text-gray-600 mb-8">
        Parece que te has adentrado en el desierto digital. No te preocupes, incluso los mejores
        exploradores se pierden a veces.
      </p>

      <!-- <button
        @click="$router.push('/')"
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        <span class="mr-2"></span> Regresar al inicio
      </button> -->
      <button
        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
        @click="$router.push('/')"
      >
        Regresar al inicio
      </button>
    </div>
  </div>
</template>
