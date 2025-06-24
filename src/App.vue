<template>
  <div class="min-h-screen bg-blue-50 text-gray-800 flex flex-col">
    <header class="bg-blue-700 text-white p-6 text-center shadow-md">
      <h1 class="text-3xl font-bold">Acuarios de Agua Dulce</h1>
      <p class="text-sm">Descubre la belleza del mundo acuático en casa</p>
    </header>

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
      <form
        @submit.prevent="submitForm"
        class="max-w-2xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label class="block mb-1 font-medium">Nombre completo</label>
          <input
            v-model="form.fullName"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">Correo</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">Teléfono</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">Mensaje</label>
          <textarea
            v-model="form.msg"
            rows="4"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
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
          </label>
        </div>

        <div id="captcha-container"></div>

        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Enviar mensaje
        </button>
      </form>
    </section>

    <footer class="bg-blue-700 text-white text-center py-4 mt-auto">
      <p>&copy; 2025 Acuarios de Agua Dulce. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'

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

let recaptchaWidgetId = null

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

  fetch('http://localhost:3001/api/contacto', {
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
}
</script>
