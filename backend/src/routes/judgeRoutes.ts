import { Router } from 'express';
import JudgeController from '../controllers/JudgeController';

const router = Router();

router.post('/checking_the_problem', JudgeController.checkProblem);

export default router;
