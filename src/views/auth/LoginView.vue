<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-sky-500 to-blue-700"
  >
    <div class="w-full max-w-md bg-white rounded-lg p-6">
      <h3 class="text-xl font-bold text-center mb-6">Iniciar sesión</h3>

      <Form
        v-bind:validation-schema="validationUserLogin"
        @submit="submitForm"
        class="flex flex-col mt-8"
      >
        <div>
          <label class="block mb-1 font-medium">Correo</label>

          <p class="w-full">
            <Field
              v-model="form.email"
              name="email"
              type="email"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="usuario@dominio.com"
            />
          </p>

          <ValidationMsg name="email" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Contraseña</label>

          <p class="w-full">
            <Field
              v-model="form.pass"
              name="password"
              type="password"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
            />
          </p>

          <ValidationMsg name="password" />
        </div>

        <button
          :disabled="isSubmitting"
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting" class="flex items-center justify-center">
            <svg
              class="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Cargando
          </span>
          <span v-else>Iniciar sesión</span>
        </button>
      </Form>

      <p class="text-gray-600 text-center mt-4">
        ¿No tienes una cuenta?
        <router-link to="/register" class="text-blue-700 hover:underline">Crear cuenta</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ValidationMsg from '@/components/auth/ValidationMsg.vue'
import { API_URL } from '@/config/apiURL'
import { validationUserLogin } from '@/schemas/validationSchema.ts'
import { jwtDecode } from 'jwt-decode'
import { Form, Field } from 'vee-validate'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)

const form = reactive({
  email: '',
  pass: '',
})

type DecodedToken = {
  id_rol_id: number
  [key: string]: any
}

function submitForm() {
  isSubmitting.value = true

  fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: form.email,
      pass: form.pass,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al iniciar sesión')
      }

      const data = await response.json()
      const token = data.token
      localStorage.setItem('token', token)

      // Decodificar el token para obtener el rol y nombre del usuario
      // const decoded = jwtDecode(token)
      const decoded = jwtDecode<DecodedToken>(token)
      // alert(`¡Bienvenido, ${data.user.fullName}!`)
      // Redireccionar según el rol
      if (decoded.id_rol_id === 2) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }

      // 💡 Si usas JWT en el futuro, aquí podrías guardar el token:
      // localStorage.setItem('token', data.token)

      // Limpia el formulario
      form.email = ''
      form.pass = ''
    })
    .catch((err) => {
      alert(err.message)
      console.error(err)
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>
