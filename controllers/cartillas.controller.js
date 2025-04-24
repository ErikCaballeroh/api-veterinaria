const connection = require('../db/connection');

exports.getCartillas = async (req, res) => {
    const { user } = req.session;

    try {
        const [rows] = await connection.query(`
            SELECT m.*, e.id AS especie_id, e.nombre AS especie_nombre  
            FROM mascotas m
            LEFT JOIN especies e ON m.especie_id = e.id
            WHERE usuario_id = ?
        `, [user.id]);

        const mascotas = rows.map(mascota => ({
            id: mascota.id,
            usuario_id: mascota.usuario_id,
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
};

exports.getConsultasByMascotaId = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query(`
            SELECT 
                c.id,
                c.nota,
                c.fecha_hora,
                s.id AS servicio_id,
                s.nombre AS servicio_nombre
            FROM consultas c
            LEFT JOIN servicios s ON c.servicio_id = s.id
            WHERE c.mascota_id = ?
        `, [id]);

        const consultas = rows.map(consulta => ({
            id: consulta.id,
            servicio: {
                id: consulta.servicio_id,
                nombre: consulta.servicio_nombre,
            },
            nota: consulta.nota,
            fecha_hora: consulta.fecha_hora,
        }));

        res.json(consultas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};