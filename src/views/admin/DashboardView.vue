<template>
  <div class="flex text-2xl font-extrabold text-gray-800 tracking-tight mb-4">
    <h1>
      Bienvenido <span class="text-blue-700">{{ userName }}</span>
    </h1>
    <p class="animate-bounce ml-2">👋</p>
  </div>

  <section class="py-10 px-4 text-center bg-blue-100">
    <h2 class="text-2xl font-semibold mb-4">Lista de Leads</h2>
    <p class="max-w-2xl mx-auto">Consulta información útil sobre todos los leads enviados.</p>
  </section>

  <div>
    <div v-if="leads.length > 0" class="overflow-x-auto">
      <div class="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg">
        <!-- Encabezados -->
        <div
          class="grid grid-cols-6 text-left text-sm text-gray-600 font-medium bg-slate-100 px-6 py-4"
        >
          <div>Nombre 🙍‍♂️</div>
          <div>Email 📨</div>
          <div>Teléfono ☎️</div>
          <div>Mensaje 💬</div>
          <div>Fecha 📅</div>
          <div>Estado 🔠</div>
        </div>

        <!-- Filas de leads -->
        <div
          v-for="lead in leads"
          :key="lead.id"
          class="grid grid-cols-6 items-start text-sm text-gray-800 px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div class="font-medium">{{ lead.fullName }}</div>
          <div class="truncate">{{ lead.email }}</div>
          <div class="whitespace-nowrap">{{ lead.phone }}</div>
          <div class="truncate text-gray-500">{{ lead.msg }}</div>
          <div class="text-gray-600">{{ formatearFecha(lead.create_at) }}</div>
          <div class="text-gray-600">{{ leadState(lead.id_state_id) }}</div>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-400 text-sm italic mt-4">No hay leads registrados.</p>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const isLoggedIn = ref(false)
const router = useRouter()
const userName = ref('')

const leads = ref([])

const leadState = (valor) => {
  if (valor === 1) return 'Nuevo'
  if (valor === 2) return 'Contactado'
  if (valor === 3) return 'Descartado'
  return 'Desconocido'
}

const formatearFecha = (fecha) => {
  return dayjs(fecha).format('DD/MM/YYYY')
}

onMounted(async () => {
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

  try {
    const response = await fetch('http://localhost:3001/api/leads', {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al obtener leads')
    }

    const data = await response.json()
    leads.value = data
  } catch (error) {
    console.error(error)
  }
})
</script>
