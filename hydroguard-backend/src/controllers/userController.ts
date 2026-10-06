import { Request, Response } from 'express';
import { pool } from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT idUsuario, nombre, apellido, correo, telefono, idRol FROM Usuario');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, correo, password, telefono, idRol } = req.body;

        if (!nombre || !apellido || !correo || !password || !idRol) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO Usuario (nombre, apellido, correo, password, telefono, idRol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellido, correo, password, telefono || null, idRol]
        );

        res.status(201).json({
            idUsuario: result.insertId,
            nombre,
            apellido,
            correo,
            idRol,
            message: 'Usuario registrado con éxito'
        });
    } catch (error: any) {
        console.error('Error al registrar usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};