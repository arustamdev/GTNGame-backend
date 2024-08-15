import express from 'express';
import { guess, restart, training } from '../../controllers/training';

const router = express.Router();

router.get('/', training);
router.post('/restart', restart);
router.post('/guess', guess);

export default router;
