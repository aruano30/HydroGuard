import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'HydroGuard_DB',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const testDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Base de datos conectada correctamente');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};