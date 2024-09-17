import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweet, updateTweet } from "../Controllers/tweet.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/create-tweet").post(createTweet)
router.route("/update-tweet/c/:tweetId").patch(updateTweet)
router.route("/delete-tweet/c/:tweetId").delete(deleteTweet)
router.route("/get-tweets").get(getUserTweet)


export default router