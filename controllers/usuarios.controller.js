const bcrypt = require("bcryptjs");
const connection = require("../db/connection");

exports.getAllEmpleados = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT u.id, u.nombre, u.apellido, u.correo, u.numero, u.contrasena_hash, 
                    r.id AS rol_id, r.nombre AS rol_nombre
             FROM usuarios u
             LEFT JOIN roles r ON u.rol_id = r.id
             WHERE u.rol_id IN (1, 2, 3)`
        );

        const empleados = rows.map(usuario => ({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            numero: usuario.numero,
            contrasena_hash: usuario.contrasena_hash,
            rol: {
                id: usuario.rol_id,
                nombre: usuario.rol_nombre
            }
        }));

        res.json(empleados);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllClientes = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT u.id, u.nombre, u.apellido, u.correo, u.numero, u.contrasena_hash, 
                    r.id AS rol_id, r.nombre AS rol_nombre
             FROM usuarios u
             LEFT JOIN roles r ON u.rol_id = r.id
             WHERE u.rol_id = 4`
        );

        const clientes = rows.map(usuario => ({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            numero: usuario.numero,
            contrasena_hash: usuario.contrasena_hash,
            rol: {
                id: usuario.rol_id,
                nombre: usuario.rol_nombre
            }
        }));

        res.json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsuarioById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query(
            `SELECT u.id, u.nombre, u.apellido, u.correo, u.numero, u.contrasena_hash, 
                    r.id AS rol_id, r.nombre AS rol_nombre
             FROM usuarios u
             LEFT JOIN roles r ON u.rol_id = r.id
             WHERE u.id = ?`, [id]
        );

        const clientes = rows.map(usuario => ({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            numero: usuario.numero,
            contrasena_hash: usuario.contrasena_hash,
            rol: {
                id: usuario.rol_id,
                nombre: usuario.rol_nombre
            }
        }));

        res.json(clientes[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, numero, contrasena } = req.body;
    if (!nombre || !apellido || !correo || !numero || !contrasena) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        const [result] = await connection.query(
            'UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, numero = ?, contrasena_hash = ? WHERE id = ?',
            [nombre, apellido, correo, numero, contrasenaHash, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}