require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

// Configuración de conexión
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

app.post('/api/contacto', async (req, res) => {
  const { fullName, email, phone, msg, captcha } = req.body

  if (!captcha) {
    return res.status(400).json({ error: 'Captcha no proporcionado' })
  }

  // Verifica el captcha con Google
  const secret = process.env.RECAPTCHA_SECRET_KEY
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`

  try {
    const response = await fetch(verifyUrl, { method: 'POST' })
    const data = await response.json()

    if (!data.success) {
      return res.status(400).json({ error: 'Captcha inválido' })
    }

    // CAPTCHA válido, guarda en BD
    const sql = `
      INSERT INTO contactos (fullName, email, phone, msg)
      VALUES (?, ?, ?, ?)
    `
    await pool.execute(sql, [fullName, email, phone, msg])
    res.status(200).json({ message: 'Mensaje guardado correctamente' })
  } catch (error) {
    console.error('❌ Error al guardar contacto:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

app.listen(port, () => {
  console.log(`✅ API escuchando en http://localhost:${port}`)
})
