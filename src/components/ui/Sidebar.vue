<template>
  <div class="relative">
    <!-- Botón de menú hamburguesa para móviles -->
    <button @click="isOpen = !isOpen" class="lg:hidden p-2">
      <span class="text-4xl hover:text-[#48CF72] transition-colors duration-250 cursor-pointer"
        ><img src="../../assets/icons/menu.png"
      /></span>
    </button>

    <!-- Sidebar -->
    <div
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      class="h-screen fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-sky-500 to-blue-700 text-white shadow-md flex flex-col p-4 transition-transform transform duration-250 lg:translate-x-0 lg:static"
    >
      <!-- Usuario Logeado -->
      <div class="flex justify-center items-center space-x-4 py-4">
        <img src="../../assets/imgs/logo.png" alt="Avatar" class="h-14 w-14 object-cover" />
        <div>
          <h3 class="text-xl font-bold">Dashboard</h3>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="mt-4 flex-1">
        <ul>
          <h5>
            <li>
              <router-link
                to="/dashboard"
                class="block font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Leads
              </router-link>
            </li>
          </h5>
        </ul>
      </nav>

      <!-- Botón de cerrar sesión -->
      <router-link to="/">
        <button
          type="button"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full mb-2"
          @click="isOpen = false"
        >
          Inicio
        </button>
      </router-link>
      <button
        class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-full mb-2"
        @click="logout"
      >
        Cerrar sesión
      </button>
      <button
        type="submit"
        class="bg-slate-500 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition w-full lg:hidden"
        @click="isOpen = false"
      >
        Ocultar
      </button>
    </div>

    <!-- Fondo oscuro al abrir el menú en móviles -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 bg-blue-100/70 z-10 lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
// import Swal from 'sweetalert2'

const isOpen = ref(false)
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// const handleLogout = () => {
//   Swal.fire({
//     title: 'Cerrar sesión',
//     text: '¿Estás seguro de que deseas cerrar sesión?',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#4877CF',
//     cancelButtonColor: '#CF4864',
//     confirmButtonText: 'Sí, cerrar sesión',
//     cancelButtonText: 'Cancelar',
//   }).then((result) => {
//     if (result.isConfirmed) {
//       localStorage.removeItem('token')
//       Swal.fire({
//         title: 'Sesión cerrada',
//         text: 'Has cerrado sesión exitosamente.',
//         icon: 'success',
//         confirmButtonText: 'Ok',
//       }).then(() => {
//         router.push('/login')
//       })
//     }
//   })
// }
</script>
