import { Request, Response } from 'express';
import { pool } from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT idUsuario, nombre, correo, idRol FROM Usuario');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nombre, correo, password, idRol } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({ 
                message: 'Todos los campos obligatorios (nombre, correo, password) deben ser llenados' 
            });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO Usuario (nombre, correo, password, idRol) VALUES (?, ?, ?, ?)',
            [nombre, correo, password, idRol || 2] 
        );

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            idUsuario: result.insertId 
        });

    } catch (error: any) {
        console.error('Error al registrar usuario:', error);

        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(400).json({ 
                message: 'El correo electrónico ya se encuentra registrado. Utiliza otro.' 
            });
        }

        res.status(500).json({ message: 'Error interno del servidor al procesar el registro' });
    }
};