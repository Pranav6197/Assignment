import express from 'express';
import { getEventsSummary, getUserActivity } from '../controllers/analyticsController';

const router = express.Router();

router.get('/events-summary', getEventsSummary);
router.get('/user-activity', getUserActivity);

export default router;
