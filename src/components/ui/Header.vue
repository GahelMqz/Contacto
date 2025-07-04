<template>
  <header class="text-white bg-gradient-to-b from-sky-500 to-blue-700 fixed z-50 w-full">
    <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
      <div class="text-2xl font-extrabold text-white tracking-tight hover:text-sky-300 flex">
        <a href="/">Mundo pez 🐟</a>
      </div>
      <ul class="flex space-x-8">
        <p class="flex items-center">
          Bienvenido <span class="font-bold ml-2">{{ userName }}</span> 👋
        </p>
        <button
          v-if="!isLoggedIn"
          @click="$router.push('/login')"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>

        <button
          v-else
          @click="logout"
          class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const isLoggedIn = ref(false)
const router = useRouter()
const userName = ref('')

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decoded = jwtDecode(token)
      userName.value = decoded.fullName || 'Usuario'
      isLoggedIn.value = true
    } catch (error) {
      userName.value = 'Usuario'
      isLoggedIn.value = false
    }
  }
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
