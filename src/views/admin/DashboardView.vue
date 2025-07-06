<template>
  <div>
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
        <div class="min-w-full divide-y divide-slate-200 bg-white shadow-sm">
          <!-- Encabezados -->
          <div
            class="grid grid-cols-7 text-left text-sm text-gray-600 font-medium bg-slate-100 px-6 py-4"
          >
            <div>Nombre 🙍‍♂️</div>
            <div>Email 📨</div>
            <div>Teléfono ☎️</div>
            <div>Mensaje 💬</div>
            <div>Fecha 📅</div>
            <div>Estado 🔠</div>
            <div>Acciones 🖱️</div>
          </div>

          <!-- Filas de leads -->
          <div
            v-for="lead in leads"
            :key="lead.id"
            class="grid grid-cols-7 items-start text-sm text-gray-800 px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div class="font-medium">{{ lead.fullName }}</div>
            <div class="truncate">{{ lead.email }}</div>
            <div class="whitespace-nowrap">{{ lead.phone }}</div>
            <div class="truncate text-gray-500">{{ lead.msg }}</div>
            <div class="text-gray-600">{{ formatearFecha(lead.create_at) }}</div>
            <div
              :class="leadState(lead.id_state_id).class"
              class="font-medium mr-auto px-3 rounded-full flex items-center"
            >
              {{ leadState(lead.id_state_id).text }}
            </div>
            <button
              @click="verDetalles(lead.id)"
              class="w-22 flex justify-center px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 hover:cursor-pointer"
            >
              <img src="../../assets/icons/eye.svg" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-400 text-sm italic mt-4">No hay leads registrados.</p>
    </div>

    <div
      class="pagination flex items-center justify-center gap-4 p-4 bg-slate-100 rounded-b shadow-sm"
    >
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
      >
        <img src="../../assets/icons/arrow.svg" class="h-5 w-5 scale-x-[-1]" />
      </button>

      <span class="text-gray-700 font-medium text-lg">
        {{ pagination.page }} de {{ pagination.totalPages }}
      </span>

      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
      >
        <img src="../../assets/icons/arrow.svg" class="h-5 w-5" />
      </button>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="isModalOpen"
        @click="closeModal"
        class="fixed inset-0 bg-blue-100/70 flex items-center justify-center z-50"
      >
        <div @click.stop class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <!-- Botón de cerrar -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 text-red-500 hover:text-red-600"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Contenido del modal -->
          <h2 class="text-xl font-semibold text-gray-600 mb-8">
            Mensaje de <span class="font-bold">{{ detalle?.fullName || 'Lead' }}</span> 💬
          </h2>

          <div class="flex gap-2 mb-2">
            <label class="text-gray-600 font-medium block">Cambiar estado</label>

            <!-- <p class="text-gray-600 font-medium">Estado:</p> -->
            <span
              :class="leadState(detalle?.id_state_id).class"
              class="font-medium px-3 rounded-full flex items-center"
            >
              {{ leadState(detalle?.id_state_id).text }}
            </span>
          </div>
          <select
            v-model="detalle.id_state_id"
            class="w-full border border-gray-300 rounded px-3 py-2 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona un estado</option>
            <option
              v-for="state in states"
              :key="state.id_state"
              :value="state.id_state"
              class="text-gray-500"
            >
              {{ leadState(state.id_state).text }}
            </option>
          </select>

          <label class="text-gray-600 font-medium block mb-2">Cuerpo del mensaje</label>
          <div class="border border-gray-300 rounded px-3 py-2 mb-8">
            <p class="text-gray-500">{{ detalle?.msg || 'No hay mensaje disponible' }}</p>
          </div>

          <div class="flex justify-center">
            <button
              @click="actualizarEstado"
              :disabled="isLoading || detalle?.id_state_id === initialStateId"
              class="px-4 py-2 w-full bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {{ isLoading ? 'Actualizando...' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import { API_URL } from '@/config/apiURL'

// Estado reactivo para el modal y datos
const isModalOpen = ref(false)
const detalle = ref(null)
const states = ref([])
const leads = ref([])
const pagination = ref({ page: 1, totalPages: 1 })
const userName = ref('Usuario')
const isLoggedIn = ref(false)
const isLoading = ref(false)
const initialStateId = ref(null)

// Función para formatear el estado del lead
const leadState = (valor) => {
  switch (valor) {
    case 1:
      return { text: 'Nuevo', class: 'bg-blue-100 text-blue-800' }
    case 2:
      return { text: 'Contactado', class: 'bg-green-100 text-green-800' }
    case 3:
      return { text: 'Descartado', class: 'bg-red-100 text-red-800' }
    default:
      return { text: 'Desconocido', class: 'bg-gray-100 text-gray-800' }
  }
}

// Función para formatear la fecha
const formatearFecha = (fecha) => {
  return dayjs(fecha).format('DD/MM/YYYY')
}

// Función genérica para manejar solicitudes y errores
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        ...options.headers,
      },
    })

    if (!res.ok) {
      const contentType = res.headers.get('content-type')
      let errorMessage = 'Error en la solicitud'

      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json()
        errorMessage = errorData.mensaje || `Error ${res.status}`
      } else {
        const text = await res.text()
        console.error('Respuesta no JSON:', text)
        errorMessage = `Error ${res.status}: Respuesta no válida del servidor`
      }

      throw new Error(errorMessage)
    }

    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await res.json()
    } else {
      const text = await res.text()
      console.error('Respuesta no JSON:', text)
      throw new Error('La respuesta del servidor no es JSON')
    }
  } catch (error) {
    console.error(`Error en ${url}:`, error)
    throw error
  }
}

// Cargar leads desde la API
async function fetchLeads(page = 1) {
  isLoading.value = true
  try {
    const json = await fetchWithErrorHandling(`${API_URL}/api/leads?page=${page}&limit=5`)
    leads.value = json.data
    pagination.value = json.pagination
  } catch (err) {
    console.error('Error al cargar leads:', err)
    alert(`Error al cargar leads: ${err.message}`)
  } finally {
    isLoading.value = false
  }
}

// Cargar estados desde la API
async function fetchStates() {
  try {
    const data = await fetchWithErrorHandling(`${API_URL}/api/states`)
    states.value = data
  } catch (error) {
    console.error('Error al obtener estados:', error)
    alert(`Error al obtener estados: ${error.message}`)
  }
}

// Obtener detalles de un lead
const verDetalles = async (id) => {
  isLoading.value = true
  try {
    const data = await fetchWithErrorHandling(`${API_URL}/api/leads/${id}`)
    detalle.value = data
    initialStateId.value = data.id_state_id
    isModalOpen.value = true
  } catch (error) {
    console.error('Error al obtener detalles del lead:', error)
    alert(`Error al obtener detalles del lead: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

// Actualizar el estado del lead
async function actualizarEstado() {
  if (!detalle.value?.id || !detalle.value?.id_state_id) {
    alert('No se puede actualizar: datos incompletos')
    return
  }

  isLoading.value = true
  try {
    const res = await fetchWithErrorHandling(`${API_URL}/api/leads/${detalle.value.id}/state`, {
      method: 'PUT',
      body: JSON.stringify({ id_state_id: detalle.value.id_state_id }),
    })

    // Actualizar la lista de leads para reflejar el cambio
    const updatedLead = leads.value.find((lead) => lead.id === detalle.value.id)
    if (updatedLead) {
      updatedLead.id_state_id = detalle.value.id_state_id
    }

    alert(res.mensaje || 'Estado actualizado correctamente')
    closeModal()
  } catch (error) {
    console.error('Error al actualizar el estado:', error)
    alert(`Error al actualizar el estado: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

// Cerrar el modal
const closeModal = () => {
  isModalOpen.value = false
  detalle.value = null
  initialStateId.value = null
}

// Cargar página de leads
const goToPage = async (page) => {
  if (page > 0 && page <= pagination.value.totalPages) {
    await fetchLeads(page)
  }
}

// Inicialización
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decoded = jwtDecode(token)
      userName.value = decoded.fullName || 'Usuario'
      isLoggedIn.value = true
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      userName.value = 'Usuario'
      isLoggedIn.value = false
    }
  } else {
    console.error('No se encontró el token en localStorage')
    alert('Por favor, inicia sesión para continuar')
  }

  await fetchLeads()
  await fetchStates()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .bg-white,
.fade-leave-active .bg-white {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.fade-enter-from .bg-white,
.fade-leave-to .bg-white {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
