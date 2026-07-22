import { Router } from 'express';
import ProblemController from '../controllers/ProblemController';

const router = Router();

router.post('/problems_codeforces', ProblemController.getCodeforcesProblems);
router.post('/full_question_codeforces', ProblemController.getFullCodeforcesQuestion);
router.post('/problems_leetcode', ProblemController.getLeetcodeProblems);
router.post('/full_leetcode_question', ProblemController.getFullLeetcodeQuestion);

export default router;
