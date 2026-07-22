import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/adding_contest_inforamtion', UserController.addContestInformation);
router.post('/getting_user_data', UserController.getUserDetails);
router.post('/finding_user', UserController.findUser);

export default router;
