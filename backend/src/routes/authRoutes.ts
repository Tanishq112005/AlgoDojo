import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/sign_up', AuthController.register);
router.post('/validating_auth', AuthMiddleware.validateAuthEndpoint);

router.post('/forgot_password', AuthController.forgotPassword);
router.post('/verification', AuthController.verifyPassword);
export default router;
