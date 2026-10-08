import { Router } from 'express';
import { getStates, updateIncidentStatus } from '../controllers/statusController';

const router = Router();

router.get('/states', getStates);
router.put('/incidents/:id/status', updateIncidentStatus);

export default router;