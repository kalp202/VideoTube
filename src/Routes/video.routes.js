import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js"
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { deleteVideo, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../Controllers/video.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/publish-video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)
router.route("/c/:videoId").get(getVideoById)
router.route("/c/:videoId").patch(
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    updateVideo
)
router.route("/delete-video/c/:videoId").delete(deleteVideo)
router.route("/toggle-publish-status/c/:videoId").patch(togglePublishStatus)


export default router