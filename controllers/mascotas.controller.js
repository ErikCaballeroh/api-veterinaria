const connection = require("../db/connection");

exports.getAllMascotas = async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT m.*, e.id AS especie_id, e.nombre AS especie_nombre, u.id AS usuario_id, u.nombre AS usuario_nombre
            FROM mascotas m
            LEFT JOIN especies e ON m.especie_id = e.id
            LEFT JOIN usuarios u ON m.usuario_id = u.id
        `);

        const mascotas = rows.map(mascota => ({
            id: mascota.id,
            usuario: {
                id: mascota.usuario_id,
                nombre: mascota.usuario_nombre,
            },
            nombre: mascota.nombre,
            especie: {
                id: mascota.especie_id,
                nombre: mascota.especie_nombre,
            },
            sexo: mascota.sexo,
            fecha_nacimiento: mascota.fecha_nacimiento,
        }));

        res.json(mascotas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getMascotaById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query(`
            SELECT m.*, e.id AS especie_id, e.nombre AS especie_nombre, u.id AS usuario_id, u.nombre AS usuario_nombre
            FROM mascotas m
            LEFT JOIN especies e ON m.especie_id = e.id
            LEFT JOIN usuarios u ON m.usuario_id = u.id
            WHERE m.id = ?
        `, [id]);

        const mascotas = rows.map(mascota => ({
            id: mascota.id,
            usuario: {
                id: mascota.usuario_id,
                nombre: mascota.usuario_nombre,
            },
            nombre: mascota.nombre,
            especie: {
                id: mascota.especie_id,
                nombre: mascota.especie_nombre,
            },
            sexo: mascota.sexo,
            fecha_nacimiento: mascota.fecha_nacimiento,
        }));

        res.json(mascotas[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createMascota = async (req, res) => {
    const { usuario_id, nombre, especie_id, fecha_nacimiento, sexo } = req.body;
    if (!usuario_id || !nombre || !especie_id || !fecha_nacimiento || !sexo) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }
    if (sexo !== 'Macho' && sexo !== 'Hembra') {
        return res.status(400).json({ message: 'Sexo inválido, debe ser "Macho" o "Hembra"' });
    }

    try {
        const [result] = await connection.query(`
            INSERT INTO mascotas (usuario_id, nombre, especie_id, fecha_nacimiento, sexo)
            VALUES (?, ?, ?, ?, ?)
        `, [usuario_id, nombre, especie_id, fecha_nacimiento, sexo]);

        res.status(201).json({ id: result.insertId, usuario_id, nombre, especie_id, fecha_nacimiento, sexo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateMascota = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, nombre, especie_id, fecha_nacimiento } = req.body;
    if (!usuario_id || !nombre || !especie_id || !fecha_nacimiento) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(`
            UPDATE  mascotas SET usuario_id = ?, nombre = ?, especie_id = ?, fecha_nacimiento = ? WHERE id = ?
        `, [usuario_id, nombre, especie_id, fecha_nacimiento, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteMascota = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await connection.query('DELETE FROM mascotas WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}