import express from 'express';

import { setGuessNumber } from '../../controllers/game';

const router = express.Router();

router.post('/setGuessNumber', setGuessNumber);

export default router;
