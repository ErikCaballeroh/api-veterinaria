const bcrypt = require("bcryptjs");
const connection = require("../db/connection");

exports.register = async (req, res) => {
    const { nombre, apellido, correo, numero, contrasena } = req.body;
    if (!nombre || !apellido || !correo || !numero || !contrasena) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await connection.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Hashear la contraseña antes de guardarla
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        // Guardar el usuario en la base de datos
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, apellido, correo, numero, contrasena_hash, rol_id) values(?, ?, ?, ?, ?, ?)',
            [nombre, apellido, correo, numero, contrasenaHash, 4]
        )

        res.status(201).json({ message: "Usuario registrado exitosamente", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const [rows] = await connection.query(`
            SELECT u.*,
                r.id as rol_id,
                r.nombre as rol_nombre
            FROM usuarios u
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE u.correo = ?
        `, [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];

        // Comparar la contraseña hasheada
        const passwordMatch = await bcrypt.compare(contrasena, user.contrasena_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Crear objeto para rol
        const rol = {
            id: user.rol_id,
            nombre: user.rol_nombre
        };

        // Guardar usuario en la sesión
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            numero: user.numero,
            rol,
        };

        res.json({ message: "Inicio de sesión exitoso", user: req.session.user });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
        res.clearCookie("connect.sid");
        res.json({ message: "Sesión cerrada" });
    });
};

exports.getSession = (req, res) => {
    if (req.session.user) {
        res.json({ session: req.session.user });
    } else {
        res.status(401).json({ message: "No hay sesión activa" });
    }
};