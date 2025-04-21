const connection = require('../db/connection');

exports.getAllServicios = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM servicios');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getServicioById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query('SELECT * FROM servicios WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

exports.createServicio = async (req, res) => {
    const { nombre, precio, categoria_id } = req.body;
    if (!nombre || !precio || !categoria_id) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(
            'INSERT INTO servicios (nombre, precio, categoria_id) VALUES (?, ?, ?)',
            [nombre, precio, categoria_id]
        );

        res.status(201).json({ id: result.insertId, nombre, precio, categoria_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateServicio = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria_id } = req.body;
    if (!nombre || !precio || !categoria_id) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const [result] = await connection.query(
            'UPDATE servicios SET nombre = ?, precio = ?, categoria_id = ? WHERE id = ?',
            [nombre, precio, categoria_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteServicio = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await connection.query('DELETE FROM servicios WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}