import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { addComment, deleteComment, getVideoComments, updateComment } from "../Controllers/comment.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/add-comment/c/:videoId").post(addComment)
router.route("/c/:commentId").post(updateComment)
router.route("/c/:commentId").get(deleteComment)
router.route("/c/:videoId").get(getVideoComments)

export default router