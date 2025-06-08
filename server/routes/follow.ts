import express from "express";
import * as FollowerController from "../controllers/followController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router();

router
    .post("/:id/follow", requireAuth, FollowerController.follow)
    .delete("/:id/follow", requireAuth, FollowerController.unfollow)
    .get("/:id/followers", FollowerController.getFollowers)
    .get("/:id/following", FollowerController.getFollowing)
    .get("/:id/is-following/:otherId", FollowerController.checkIsFollowing)

export default router;


