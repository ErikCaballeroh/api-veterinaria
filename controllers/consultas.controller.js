const connection = require('../db/connection');

exports.getAllConsultas = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM consultas');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getConsultaById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query('SELECT * FROM consultas WHERE id = ?', [id]);
        res.json(rows[0]);
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