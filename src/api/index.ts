import express from 'express';
import trainingRoute from './training';
import gameroute from './game';
import auth from '../middlewares/auth';

const router = express.Router();

router.use('/training', auth, trainingRoute);
router.use('/game', auth, gameroute);

export default router;
