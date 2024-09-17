import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelDetails, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage, updateUserAvatar } from "../Controllers/user.controller.js"
import { upload } from "../Middlewares/multer.middleware.js"
import { verifyJWT } from "../Middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([                  //middlewear
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)


router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelDetails)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;