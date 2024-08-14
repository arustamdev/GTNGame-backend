import express from 'express';
import { training } from '../../controllers/training';

const router = express.Router();

router.get('/', training);

export default router;
