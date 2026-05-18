import { Router } from 'express';
import { getMe, login, register } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginValidator, registerValidator } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.get('/me', authenticate, getMe);

export default router;
