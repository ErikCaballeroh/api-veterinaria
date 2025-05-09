const connection = require('../db/connection');

exports.getAllCitas = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM citas');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getCitaById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query('SELECT * FROM citas WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getAllCitasByUsuario = async (req, res) => {
    const { user } = req.session;

    try {
        const [rows] = await connection.query('SELECT * FROM citas WHERE usuario_id = ?', [user.id]);
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