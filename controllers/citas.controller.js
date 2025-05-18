const connection = require('../db/connection');

exports.getAllCitas = async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT c.id, c.fecha_hora,
                   u.id AS usuario_id, u.nombre AS usuario_nombre,
                   m.id AS mascota_id, m.nombre AS mascota_nombre,
                   s.id AS servicio_id, s.nombre AS servicio_nombre
            FROM citas c
            JOIN usuarios u ON c.usuario_id = u.id
            JOIN mascotas m ON c.mascota_id = m.id
            JOIN servicios s ON c.servicio_id = s.id
        `);
        const citas = rows.map(row => ({
            id: row.id,
            fecha_hora: row.fecha_hora,
            usuario: { id: row.usuario_id, nombre: row.usuario_nombre },
            mascota: { id: row.mascota_id, nombre: row.mascota_nombre },
            servicio: { id: row.servicio_id, nombre: row.servicio_nombre }
        }));
        res.json(citas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getCitaById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query(`
            SELECT c.id, c.fecha_hora,
                   u.id AS usuario_id, u.nombre AS usuario_nombre,
                   m.id AS mascota_id, m.nombre AS mascota_nombre,
                   s.id AS servicio_id, s.nombre AS servicio_nombre
            FROM citas c
            JOIN usuarios u ON c.usuario_id = u.id
            JOIN mascotas m ON c.mascota_id = m.id
            JOIN servicios s ON c.servicio_id = s.id
            WHERE c.id = ?
        `, [id]);
        if (!rows[0]) return res.status(404).json({ message: 'Registro no encontrado' });
        const cita = {
            id: rows[0].id,
            fecha_hora: rows[0].fecha_hora,
            usuario: { id: rows[0].usuario_id, nombre: rows[0].usuario_nombre },
            mascota: { id: rows[0].mascota_id, nombre: rows[0].mascota_nombre },
            servicio: { id: rows[0].servicio_id, nombre: rows[0].servicio_nombre }
        };
        res.json(cita);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getAllCitasByUsuario = async (req, res) => {
    const { user } = req.session;

    try {
        const [rows] = await connection.query(`
            SELECT c.id, c.fecha_hora, 
                   JSON_OBJECT('id', m.id, 'nombre', m.nombre) AS mascota,
                   JSON_OBJECT('id', s.id, 'nombre', s.nombre) AS servicio
            FROM citas c
            JOIN mascotas m ON c.mascota_id = m.id
            JOIN servicios s ON c.servicio_id = s.id
            WHERE c.usuario_id = ?`, [user.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createCita = async (req, res) => {
    const { usuario_id, mascota_id, fecha_hora, servicio_id } = req.body;

    if (!usuario_id || !mascota_id || !fecha_hora || !servicio_id) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(`
            INSERT INTO citas (usuario_id, mascota_id, fecha_hora, servicio_id)
            VALUES (?, ?, ?, ?)`, [usuario_id, mascota_id, fecha_hora, servicio_id]
        );

        res.status(201).json({ id: result.insertId, usuario_id, mascota_id, fecha_hora, servicio_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateCita = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, mascota_id, fecha_hora, servicio_id } = req.body;

    if (!usuario_id || !mascota_id || !fecha_hora || !servicio_id) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(`
            UPDATE citas SET usuario_id = ?, mascota_id = ?, fecha_hora = ?, servicio_id = ?
            WHERE id = ?`, [usuario_id, mascota_id, fecha_hora, servicio_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteCita = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await connection.query('DELETE FROM citas WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}