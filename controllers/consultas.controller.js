const connection = require('../db/connection');

exports.getAllConsultas = async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT c.id, c.nota, c.fecha_hora,
                   u.id AS usuario_id, u.nombre AS usuario_nombre,
                   m.id AS mascota_id, m.nombre AS mascota_nombre,
                   s.id AS servicio_id, s.nombre AS servicio_nombre
            FROM consultas c
            JOIN usuarios u ON c.usuario_id = u.id
            JOIN mascotas m ON c.mascota_id = m.id
            JOIN servicios s ON c.servicio_id = s.id
        `);
        const consultas = rows.map(row => ({
            id: row.id,
            nota: row.nota,
            fecha_hora: row.fecha_hora,
            usuario: { id: row.usuario_id, nombre: row.usuario_nombre },
            mascota: { id: row.mascota_id, nombre: row.mascota_nombre },
            servicio: { id: row.servicio_id, nombre: row.servicio_nombre }
        }));
        res.json(consultas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getConsultaById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query(`
            SELECT c.id, c.nota, c.fecha_hora,
                   u.id AS usuario_id, u.nombre AS usuario_nombre,
                   m.id AS mascota_id, m.nombre AS mascota_nombre,
                   s.id AS servicio_id, s.nombre AS servicio_nombre
            FROM consultas c
            JOIN usuarios u ON c.usuario_id = u.id
            JOIN mascotas m ON c.mascota_id = m.id
            JOIN servicios s ON c.servicio_id = s.id
            WHERE c.id = ?
        `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Consulta no encontrada' });
        }
        const row = rows[0];
        const consulta = {
            id: row.id,
            nota: row.nota,
            fecha_hora: row.fecha_hora,
            usuario: { id: row.usuario_id, nombre: row.usuario_nombre },
            mascota: { id: row.mascota_id, nombre: row.mascota_nombre },
            servicio: { id: row.servicio_id, nombre: row.servicio_nombre }
        };
        res.json(consulta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createConsulta = async (req, res) => {
    const { usuario_id, mascota_id, nota, fecha_hora, servicio_id } = req.body;

    if (!usuario_id || !mascota_id || !nota || !fecha_hora || !servicio_id) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(`
            INSERT INTO consultas (usuario_id, mascota_id, nota, fecha_hora, servicio_id)
            VALUES (?, ?, ?, ?, ?)`, [usuario_id, mascota_id, nota, fecha_hora, servicio_id]
        );

        res.status(201).json({ id: result.insertId, usuario_id, mascota_id, nota, fecha_hora, servicio_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateConsulta = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, mascota_id, nota, fecha_hora, servicio_id } = req.body;

    if (!usuario_id || !mascota_id || !nota || !fecha_hora || !servicio_id) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(`
            UPDATE consultas SET usuario_id = ?, mascota_id = ?, nota = ?, fecha_hora = ?, servicio_id = ?
            WHERE id = ?`, [usuario_id, mascota_id, nota, fecha_hora, servicio_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteConsulta = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await connection.query('DELETE FROM consultas WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}