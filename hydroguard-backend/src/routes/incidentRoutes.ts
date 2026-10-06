import { Router } from 'express';
import { getIncidents, createIncident } from '../controllers/incidentController';

const router = Router();

router.get('/incidents', getIncidents);
router.post('/incidents', createIncident);

export default router;