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

// Ruta para guardar contacto
app.post('/api/contacto', async (req, res) => {
  const { fullName, email, phone, msg } = req.body

  try {
    const sql = `
      INSERT INTO contactos (fullName, email, phone, msg)
      VALUES (?, ?, ?, ?)
    `
    const [result] = await pool.execute(sql, [fullName, email, phone, msg])

    res.status(200).json({ message: 'Mensaje guardado correctamente' })
  } catch (error) {
    console.error('❌ Error al guardar contacto:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

app.listen(port, () => {
  console.log(`✅ API escuchando en http://localhost:${port}`)
})
