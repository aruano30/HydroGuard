import { Request, Response } from 'express';
import { pool } from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getIncidents = async (req: Request, res: Response) => {
    try {
        const { idEstado, idUsuario } = req.query;
        
        let query = 'SELECT * FROM Incidencia WHERE 1=1';
        const params: any[] = [];

        if (idEstado) {
            query += ' AND idEstado = ?';
            params.push(idEstado);
        }

        if (idUsuario) {
            query += ' AND idUsuario = ?';
            params.push(idUsuario);
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener incidencias:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createIncident = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, ubicacion, idUsuario, idEstado } = req.body;
        
        if (!titulo || !descripcion || !ubicacion || !idUsuario) {
            return res.status(400).json({ message: 'Faltan campos obligatorios (titulo, descripcion, ubicacion, idUsuario)' });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO Incidencia (titulo, descripcion, ubicacion, idUsuario, idEstado) VALUES (?, ?, ?, ?, ?)',
            [titulo, descripcion, ubicacion, idUsuario, idEstado || 1] 
        );

        res.status(201).json({ 
            message: 'Incidencia creada exitosamente', 
            idIncidencia: result.insertId 
        });
    } catch (error) {
        console.error('Error al crear incidencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};