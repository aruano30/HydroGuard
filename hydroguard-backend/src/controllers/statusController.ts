import { Request, Response } from 'express';
import { pool } from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getStates = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM EstadoIncidencia');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener estados:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { idEstado, idRolUsuario } = req.body; 

        if (!idEstado) {
            return res.status(400).json({ message: 'El idEstado es obligatorio' });
        }

        const ROL_ADMIN = 1; 
        if (idRolUsuario !== ROL_ADMIN) {
            return res.status(403).json({ 
                message: 'Acceso denegado: Se requiere rol de Administrador para actualizar estados' 
            });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE Incidencia SET idEstado = ? WHERE idIncidencia = ?',
            [idEstado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }

        res.json({ message: 'Estado de la incidencia actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};