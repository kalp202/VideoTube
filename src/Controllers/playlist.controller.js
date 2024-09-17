import asyncHandler from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { Playlist } from "../Models/playlist.model.js"
import mongoose from "mongoose"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (name.trim() === "")
        throw new ApiError(400, "Playlist name is required")

    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: req.user._id
        }
    )

    const newPlaylist = await Playlist.findById(playlist._id)
    if (!newPlaylist)
        throw new ApiError(500, "Something went wrong while creating new playlist")

    return res.status(200).json(
        new ApiResponse(
            200,
            newPlaylist,
            "Playlist created successfully."
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId)
        throw new ApiError(400, "User id is required")

    const allPlaylists = await Playlist.find(
        {
            owner: userId
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            allPlaylists,
            "All playlists are fetched successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId)
        throw new ApiError(400, "Playlist id is required")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        throw new ApiError(400, "Playlist not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist fetched successfully"
        )
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!playlistId)
        throw new ApiError(400, "Playlist id is required")
    if (!videoId)
        throw new ApiError(400, "Video id is required")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        throw new ApiError(400, "Playlist not found")

    playlist.videos.push(new mongoose.Types.ObjectId(videoId))

    const updatedPlaylist = await playlist.save({ validateBeforeSave: false })
    if (!updatedPlaylist)
        throw new ApiError(500, "Something went wrong while adding video to playlist")

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video added successfully"
        )
    )
})

const removeVideoFromPlayList = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!playlistId)
        throw new ApiError(400, "Playlist id is required")
    if (!videoId)
        throw new ApiError(400, "Video id is required")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        throw new ApiError(400, "Playlist not found")

    playlist.videos = playlist.videos.filter((video) => (video._id != videoId))

    const updatedPlayList = await playlist.save({ validateBeforeSave: false })
    if (!updatedPlayList)
        throw new ApiError(500, "Something went wrong while deleting video from playlist")

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPlayList,
            "Video deleted successfully"
        )
    )
})

const deletePlayList = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId)
        throw new ApiError(400, "Playlist id is required")

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if (!playlist)
        throw new ApiError(400, "Something went wrong while deleting playlist")

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist deleted successfully"
        )
    )
})

const updatePlayList = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId)
        throw new ApiError(400, "Playlist id is required")

    const { name, description } = req.body
    if (!name && name.trim() === "" && !description && description.trim() === "")
        throw new ApiError(400, "Details are required")

    const details = {}
    if (name) details.name = name
    if (description) details.description = description

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        details,
        { new: true }
    )
    if (!updatedPlaylist)
        throw new ApiError(500, "Something went wrong while updating playlist")

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Playlist details updated successfully"
        )
    )
})


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    deletePlayList,
    removeVideoFromPlayList,
    updatePlayList
}