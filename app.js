require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true // Permite enviar cookies desde el navegador
}));

app.use(express.json());

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
        sameSite: 'lax', // Necesario para cookies cross-origin con CORS
        secure: false // Solo true si usas HTTPS
    }
}));

const authRoutes = require('./routes/auth.routes');

app.use('/api/auth', authRoutes);


// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
