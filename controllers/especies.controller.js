const connection = require("../db/connection");

exports.getAllEspecies = async (req, res) => {
    try {
        const [rows] = await connection.query(`SELECT * FROM especies`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getEspecieById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query(`SELECT * FROM especies WHERE id = ?`, [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createEspecie = async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(`INSERT INTO especies (nombre) VALUES (?)`, [nombre]);
        res.status(201).json({ id: result.insertId, nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateEspecie = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(`
            UPDATE  especies SET nombre = ? WHERE id = ?
        `, [nombre, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteEspecie = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await connection.query('DELETE FROM especies WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}