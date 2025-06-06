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
const usuariosRoutes = require('./routes/usuarios.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const mascotasRoutes = require('./routes/mascotas.routes');
const especiesRoutes = require('./routes/especies.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const consultasRoutes = require('./routes/consultas.routes');
const citasRoutes = require('./routes/citas.routes');
const cartillasRoutes = require('./routes/cartillas.routes');
const usuarioCitasRoutes = require('./routes/usuarioCitas.routes');

const {
    auth,
    checkRole,
} = require('./middlewares');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/especies', especiesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/me/cartillas', auth, cartillasRoutes);
app.use('/api/me/', auth, usuarioCitasRoutes);


// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
