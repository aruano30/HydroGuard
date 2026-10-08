import { Request, Response } from 'express';
import { pool } from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT idUsuario, nombre, apellido, correo, idRol FROM Usuario');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, correo, password, telefono, idRol } = req.body;

        if (!nombre || !apellido || !correo || !password) {
            return res.status(400).json({ 
                message: 'Todos los campos obligatorios deben ser llenados' 
            });
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO Usuario (nombre, apellido, correo, password, telefono, idRol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellido, correo, password, telefono || null, idRol || 2] 
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

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ 
                message: 'El correo y la contraseña son obligatorios' 
            });
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT idUsuario, nombre, apellido, correo, password, idRol FROM Usuario WHERE correo = ?',
            [correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const usuario = rows[0];

        if (usuario.password !== password) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        res.json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                idUsuario: usuario.idUsuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                idRol: usuario.idRol
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión' });
    }
};