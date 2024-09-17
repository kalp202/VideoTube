import asyncHandler from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/ApiError.js"
import { deleteVideoFromCloudinary, deleteImageFromCloudinary, uploadOnCloudinary } from "../Utils/cloudinary.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { Video } from "../Models/video.model.js"


const publishAVideo = asyncHandler(async (req, res) => {
    //1. Get data
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "All details are required")
    }

    //Get video and thumbnail
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(401, "Video is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(401, "Thumbnail is required")
    }

    //3. Upload on cloudinary
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!video) {
        throw new ApiError(401, "Video is required")
    }
    if (!thumbnail) {
        throw new ApiError(401, "Thumbnail is required")
    }

    //4.create new entry in DB.
    const videoDetails = await Video.create(
        {
            title,
            description,
            videoFile: video.url,
            thumbnail: thumbnail.url,
            duration: video.duration,
            owner: req.user?._id
        }
    )

    //5. Get details from DB.
    const uploadedVideo = await Video.findById(videoDetails._id)

    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong while uploading a video")
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            uploadedVideo,
            "Video uploaded successfully."
        )
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(401, "Video Id is required")
    }

    const videoDetails = await Video.findById(videoId)

    if (!videoDetails) {
        throw new ApiError(401, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            videoDetails,
            "Video found successfully."
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId)
        throw new ApiError(400, "Video Id is required.")

    const { title, description } = req.body
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!title && !description && !thumbnailLocalPath)
        throw new ApiError(401, "Provide details to update")

    let thumbnail
    if (thumbnailLocalPath) {
        const videoDetails = await Video.findById(videoId)
        if (!videoDetails) {
            throw new ApiError(404, "Video not found.");
        }

        const response = await deleteImageFromCloudinary(videoDetails.thumbnail)
        if (!response)
            throw new ApiError(401, "Thumbnail does not found.")

        thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (thumbnail) updateData.thumbnail = thumbnail.url;

    const updatedDetails = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateData
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedDetails,
            "Details updated successfully"
        )
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const videoDetails = await Video.findByIdAndDelete(videoId)
    if (!videoDetails)
        throw new ApiError(400, "Video not found")

    const video = await deleteVideoFromCloudinary(videoDetails.videoFile)
    const thumbnail = await deleteImageFromCloudinary(videoDetails.thumbnail)
    if (!video || !thumbnail)
        throw new ApiError(400, "Video does not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            videoDetails,
            "Video deleted successfully"
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId)
        throw new ApiError(400, "Video id is required")

    const video = await Video.findById(videoId)
    if (!video)
        throw new ApiError(400, "Video not found")
    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(
            201,
            video,
            "Publish status changed successfully"
        )
    )
})


export {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}