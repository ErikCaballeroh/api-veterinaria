const connection = require('../db/connection');

exports.getAllCitas = async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT c.id, c.fecha_hora,
                   JSON_OBJECT('id', u.id, 'nombre', u.nombre) AS usuario,
                   JSON_OBJECT('id', m.id, 'nombre', m.nombre) AS mascota,
                   JSON_OBJECT('id', s.id, 'nombre', s.nombre) AS servicio
            FROM citas c
            JOIN usuarios u ON c.usuario_id = u.id
            JOIN mascotas m ON c.mascota_id = m.id
            JOIN servicios s ON c.servicio_id = s.id
        `);
        const citas = rows.map(row => ({
            ...row,
            usuario: JSON.parse(row.usuario),
            mascota: JSON.parse(row.mascota),
            servicio: JSON.parse(row.servicio)
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
                   JSON_OBJECT('id', u.id, 'nombre', u.nombre) AS usuario,
                   JSON_OBJECT('id', m.id, 'nombre', m.nombre) AS mascota,
                   JSON_OBJECT('id', s.id, 'nombre', s.nombre) AS servicio
            FROM citas c
            JOIN usuarios u ON c.usuario_id = u.id
            JOIN mascotas m ON c.mascota_id = m.id
            JOIN servicios s ON c.servicio_id = s.id
            WHERE c.id = ?
        `, [id]);
        if (!rows[0]) return res.status(404).json({ message: 'Registro no encontrado' });
        const cita = {
            ...rows[0],
            usuario: JSON.parse(rows[0].usuario),
            mascota: JSON.parse(rows[0].mascota),
            servicio: JSON.parse(rows[0].servicio)
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