import express from 'express';
import fruitsRoute from './fruits';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Hello from api!',
  });
});

router.use('/fruits', fruitsRoute);

export default router;
