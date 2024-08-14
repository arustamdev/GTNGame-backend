import express from 'express';
import trainingRoute from './training';
import auth from '../middlewares/auth';

const router = express.Router();

router.use('/training', auth, trainingRoute);

export default router;
