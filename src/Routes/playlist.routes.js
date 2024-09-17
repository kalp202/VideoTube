import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { addVideoToPlaylist, createPlaylist, deletePlayList, getPlaylistById, getUserPlaylists, removeVideoFromPlayList, updatePlayList } from "../Controllers/playlist.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/create-playlist").post(createPlaylist)
router.route("/user-playlists/c/:userId").get(getUserPlaylists)
router.route("/c/:playlistId").get(getPlaylistById)
router.route("/add-video/c/:videoId/c/:playlistId").patch(addVideoToPlaylist)
router.route("/remove-video/c/:videoId/c/:playlistId").patch(removeVideoFromPlayList)
router.route("/delete-playlist/c/:playlistId").delete(deletePlayList)
router.route("/update-playlist/c/:playlistId").patch(updatePlayList)


export default router