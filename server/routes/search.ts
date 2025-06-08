import { Router } from 'express';
import { searchSystem, checkUsername, checkEmail } from '../controllers/searchController';

const router = Router();

router
    .get('/', searchSystem)
    .get('/username', checkUsername)
    .get('/email', checkEmail)

export default router;
