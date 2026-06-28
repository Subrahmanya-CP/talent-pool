// import express from 'express';
// import { matchJob } from '../controllers/jobMatchController.js';

// const router = express.Router();

// router.post('/match', matchJob);

// export default router;

// import express from 'express';
// import { matchJob } from '../controllers/jobMatchController.js';

// console.log(" jobMatchRoutes loaded");

// const router = express.Router();

// router.post('/match', matchJob);

// export default router;

import express from 'express';
import { matchJob } from '../controllers/jobMatchController.js';

console.log("✅ jobMatchRoutes loaded");

const router = express.Router();

router.get('/match', (req, res) => {
  res.json({ message: "GET route working" });
});

router.post('/match', matchJob);

export default router;