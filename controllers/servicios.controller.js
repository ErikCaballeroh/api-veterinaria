const connection = require('../db/connection');

exports.getAllServicios = async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT s.id, s.nombre, s.precio, c.id AS categoria_id, c.nombre AS categoria_nombre
            FROM servicios s
            JOIN categorias c ON s.categoria_id = c.id
        `);
        const servicios = rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            precio: row.precio,
            categoria: {
                id: row.categoria_id,
                nombre: row.categoria_nombre
            }
        }));
        res.json(servicios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getServicioById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await connection.query(`
            SELECT s.id, s.nombre, s.precio, c.id AS categoria_id, c.nombre AS categoria_nombre
            FROM servicios s
            JOIN categorias c ON s.categoria_id = c.id
            WHERE s.id = ?
        `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        const row = rows[0];
        const servicio = {
            id: row.id,
            nombre: row.nombre,
            precio: row.precio,
            categoria: {
                id: row.categoria_id,
                nombre: row.categoria_nombre
            }
        };
        res.json(servicio);
    } catch (err) {
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