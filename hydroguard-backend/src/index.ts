import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDatabaseConnection } from './db/database';
import incidentRoutes from './routes/incidentRoutes';
import userRoutes from './routes/userRoutes';
import statusRoutes from './routes/statusRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', incidentRoutes);
app.use('/api', userRoutes);
app.use('/api', statusRoutes); 

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT} !!!`);
    await testDatabaseConnection();
});