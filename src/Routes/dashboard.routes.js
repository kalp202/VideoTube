import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../Controllers/dashboard.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/get-channel-stats").get(getChannelStats)
router.route("/get-videos").get(getChannelVideos)

export default router