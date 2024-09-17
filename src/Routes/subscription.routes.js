import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscriptionStatus } from "../Controllers/subscription.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/c/:channelId").post(toggleSubscriptionStatus)
router.route("/get-subscribers/c/:channelId").get(getUserChannelSubscribers)
router.route("/get-subscribed-channels/c/:subscriberId").get(getSubscribedChannels)

export default router