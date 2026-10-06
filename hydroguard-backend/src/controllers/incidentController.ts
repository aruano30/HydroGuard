import { Request, Response } from 'express';
import { pool } from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getIncidents = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT i.*, e.nombreEstado, u.nombre AS nombreUsuario 
            FROM Incidencia i
            JOIN EstadoIncidencia e ON i.idEstado = e.idEstado
            JOIN Usuario u ON i.idUsuario = u.idUsuario
            ORDER BY i.fechaCreacion DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener incidencias:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createIncident = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, ubicacion, idUsuario } = req.body;

        if (!titulo || !descripcion || !ubicacion || !idUsuario) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios (incluyendo idUsuario)' });
        }

        const idEstadoDefault = 1; 

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO Incidencia (titulo, descripcion, ubicacion, idUsuario, idEstado) VALUES (?, ?, ?, ?, ?)',
            [titulo, descripcion, ubicacion, idUsuario, idEstadoDefault]
        );

        res.status(201).json({
            idIncidencia: result.insertId,
            titulo,
            descripcion,
            ubicacion,
            idUsuario,
            idEstado: idEstadoDefault,
            message: 'Incidencia reportada con éxito'
        });
    } catch (error) {
        console.error('Error al crear incidencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};