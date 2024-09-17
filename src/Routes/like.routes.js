import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../Controllers/like.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/like-video/c/:videoId").post(toggleVideoLike)
router.route("/like-comment/c/:commentId").post(toggleCommentLike)
router.route("/like-tweet/c/:tweetId").post(toggleTweetLike)
router.route("/liked-videos").get(getLikedVideos)



export default router