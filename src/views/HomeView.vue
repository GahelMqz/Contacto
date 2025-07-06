<template>
  <div class="min-h-screen bg-blue-50 text-gray-800 flex flex-col">
    <Header />

    <div class="bg-blue-700 text-white px-6 pb-6 pt-22 text-center shadow-md">
      <h1 class="text-3xl font-bold">Acuarios de Agua Dulce</h1>
      <p class="text-sm">Descubre la belleza del mundo acuático en casa</p>
    </div>

    <section class="py-10 px-4 text-center bg-blue-100">
      <h2 class="text-2xl font-semibold mb-4">¡Bienvenido a tu portal de peces de agua dulce!</h2>
      <p class="max-w-2xl mx-auto">
        Explora información útil sobre los peces más populares, cuidados y tips para mantener tu
        acuario saludable y hermoso.
      </p>
    </section>

    <section class="py-10 px-4 bg-white">
      <h3 class="text-xl font-bold text-center mb-6">Algunos peces populares</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div
          v-for="fish in fishList"
          :key="fish.id"
          class="bg-blue-100 rounded-lg shadow-md p-4 text-center hover:scale-105 transform transition"
        >
          <img :src="fish.image" :alt="fish.name" class="w-full h-48 object-cover rounded mb-4" />
          <h4 class="font-bold text-lg mb-2">{{ fish.name }}</h4>
          <p class="text-sm text-gray-700">{{ fish.description }}</p>
        </div>
      </div>
    </section>

    <section class="py-10 px-4 bg-blue-50">
      <h3 class="text-xl font-bold text-center mb-6">Contáctanos</h3>
      <Form
        v-bind:validation-schema="validationContactForm"
        @submit="submitForm"
        class="max-w-2xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label class="block mb-1 font-medium">Nombre</label>
          <Field
            name="fullName"
            v-model="form.fullName"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="Juan Pérez"
          />

          <ValidationMsg name="fullName" />
        </div>
        <div>
          <label class="block mb-1 font-medium">Correo</label>
          <Field
            name="email"
            v-model="form.email"
            type="email"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="usuario@dominio.com"
          />

          <ValidationMsg name="email" />
        </div>
        <div>
          <label class="block mb-1 font-medium">Teléfono</label>
          <Field
            v-model="form.phone"
            type="tel"
            name="phone"
            id="phone"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="998 144 1712"
          />

          <ValidationMsg name="phone" />
        </div>
        <div>
          <label class="block mb-1 font-medium">Mensaje</label>
          <Field
            name="msg"
            as="textarea"
            v-model="form.msg"
            rows="4"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="Escribe tu mensaje aquí..."
          />

          <ValidationMsg name="msg" />
        </div>

        <div class="flex items-start space-x-2">
          <input
            type="checkbox"
            v-model="form.acceptPrivacy"
            class="mt-1 accent-blue-600"
            id="privacy"
            required
          />
          <label for="privacy" class="text-sm text-gray-700">
            Acepto los
            <a
              href="https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fidaip.org.mx%2Farchivos%2Fpdp%2FFormato_Aviso_de_Privacidad_Simplificado_2022.docx&wdOrigin=BROWSELINK"
              class="text-blue-600 underline hover:text-blue-800"
              >Avisos de privacidad</a
            >
            y
            <a
              href="https://protecciondatos-lopd.com/empresas/wp-content/uploads/2023/09/Terminos-condiciones-pagina-web.pdf"
              class="text-blue-600 underline hover:text-blue-800"
              >Términos y condiciones</a
            >
          </label>
        </div>

        <div id="captcha-container"></div>

        <button
          :disabled="isSubmitting"
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
            Enviando
          </span>
          <span v-else>Enviar mensaje</span>
        </button>
      </Form>
    </section>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import ValidationMsg from '@/components/auth/ValidationMsg.vue'
import Footer from '@/components/ui/Footer.vue'
import Header from '@/components/ui/Header.vue'
import { validationContactForm } from '@/schemas/validationSchema'
import { Form, Field } from 'vee-validate'
import 'intl-tel-input/build/css/intlTelInput.css'
import intlTelInput from 'intl-tel-input'
import { reactive, onMounted, ref } from 'vue'
import emailjs from 'emailjs-com'
import { API_URL } from '@/config/apiURL'

const isSubmitting = ref(false)
const iti = ref({})
const phoneError = ref('')
const error = ref('')

declare global {
  interface Window {
    grecaptcha: any
  }
}

interface Fish {
  id: number
  name: string
  description: string
  image: string
}

const fishList: Fish[] = [
  {
    id: 1,
    name: 'Betta Splendens',
    description: 'Colorido y territorial. Requiere cuidados individuales.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Betta04.jpg/1200px-Betta04.jpg',
  },
  {
    id: 2,
    name: 'Neón Tetra',
    description: 'Pacífico, ideal para acuarios comunitarios. Muy llamativo.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/54/Neonka_obecna_paracheirodon_innesi.jpg',
  },
  {
    id: 3,
    name: 'Guppy',
    description: 'Resistente y fácil de cuidar. Muy recomendado para principiantes.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Guppy_10-18-2006_10-57-10_AM.jpg',
  },
]

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  msg: '',
  acceptPrivacy: false, // 👈 nuevo campo
})

let recaptchaWidgetId: null = null

onMounted(() => {
  const interval = setInterval(() => {
    if (window.grecaptcha) {
      clearInterval(interval)
      window.grecaptcha.ready(() => {
        recaptchaWidgetId = window.grecaptcha.render('captcha-container', {
          sitekey: '6LcLfWwrAAAAAO-0m8gn9qvC2pNAXkGPgXKvkGMz',
        })
      })
    }
  }, 300)

  // const input = document.querySelector('#phone')
  // iti.value = intlTelInput(input, {
  //   loadUtils: () => import('../../node_modules/intl-tel-input/build/js/utils.js'),
  //   initialCountry: 'MX',
  //   containerClass: 'w-full text-[#565656]',
  // })
})

function submitForm() {
  if (!form.acceptPrivacy) {
    alert('Debes aceptar los Avisos de privacidad.')
    return
  }

  const token = window.grecaptcha.getResponse(recaptchaWidgetId)
  if (!token) {
    alert('Completa el captcha.')
    return
  }

  isSubmitting.value = true

  fetch(`${API_URL}/api/contacto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      msg: form.msg,
      captcha: token,
    }),
  })
    .then(() => {
      // Enviar correo al admin vía EmailJS
      return emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,

        {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          msg: form.msg,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
    })

    .then(() => {
      alert('¡Mensaje enviado!')
      form.fullName = ''
      form.email = ''
      form.phone = ''
      form.msg = ''
      form.acceptPrivacy = false
      window.grecaptcha.reset(recaptchaWidgetId)
    })
    .catch((err) => {
      alert('Error al enviar')
      console.error(err)
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>

<style scoped>
.iti {
  --iti-path-flags-1x: url('../../node_modules/intl-tel-input/build/img/flags.webp');
  --iti-path-flags-2x: url('../../node_modules/intl-tel-input/build/img/flags@2x.webp');
  --iti-path-globe-1x: url('../../node_modules/intl-tel-input/build/img/globe.webp');
  --iti-path-globe-2x: url('../../node_modules/intl-tel-input/build/img/globe@2x.webp');
}
</style>
