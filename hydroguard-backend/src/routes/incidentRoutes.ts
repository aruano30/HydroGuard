import { Router } from 'express';
import { getIncidents, createIncident, updateIncidentStatus } from '../controllers/incidentController';

const router = Router();

router.get('/incidents', getIncidents);
router.post('/incidents', createIncident);
router.put('/incidents/:id/status', updateIncidentStatus);

export default router;