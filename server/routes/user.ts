import { Router } from 'express';
import { getProfileStats, updateUserProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const router = Router();

router
    .get('/profile/:username', getProfileStats)
    .patch("/profile", requireAuth, upload.single("avatar"), updateUserProfile)

export default router;