import asyncHandler from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { Like } from "../Models/like.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId)
        throw new ApiError(400, "Video not found")

    const isLiked = await Like.findOne(
        {
            video: videoId,
            likedBy: req.user._id
        }
    )

    if (isLiked) {
        const removedLike = await Like.findByIdAndDelete(isLiked._id)
        if (!removedLike)
            throw new ApiError(500, "Somthing wetn wrong while removing like")

        return res.status(200).json(
            new ApiResponse(
                200,
                removedLike,
                "Like removed successfully"
            )
        )
    }

    const like = await Like.create(
        {
            video: videoId,
            likedBy: req.user._id
        }
    )

    const likedVideo = await Like.findById(like._id)
    if (!likedVideo)
        throw new ApiError(500, "Something went wrong while liking the video")

    return res.status(200).json(
        new ApiResponse(
            200,
            likedVideo,
            "Like added successfully"
        )
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId)
        throw new ApiError(400, "Comment not found")

    const isLiked = await Like.findOne(
        {
            comment: commentId,
            likedBy: req.user._id
        }
    )

    if (isLiked) {
        const removedLike = await Like.findByIdAndDelete(isLiked._id)

        if (!removedLike)
            throw new ApiError(500, "Somthing wetn wrong while removing like")

        return res.status(200).json(
            new ApiResponse(
                200,
                removedLike,
                "Like removed successfully"
            )
        )
    }

    const like = await Like.create(
        {
            comment: commentId,
            likedBy: req.user._id
        }
    )

    const likedComment = await Like.findById(like._id)
    if (!likedComment)
        throw new ApiError(500, "Something went wrong while liking the comment")

    return res.status(200).json(
        new ApiResponse(
            200,
            likedComment,
            "Like added successfully"
        )
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId)
        throw new ApiError(400, "Tweet not found")

    const isLiked = await Like.findOne(
        {
            tweet: tweetId,
            likedBy: req.user._id
        }
    )
    console.log(isLiked);

    if (isLiked) {
        const removedLike = await Like.findByIdAndDelete(isLiked._id)

        if (!removedLike)
            throw new ApiError(500, "Somthing wetn wrong while removing like")

        return res.status(200).json(
            new ApiResponse(
                200,
                removedLike,
                "Like removed successfully"
            )
        )
    }

    const like = await Like.create(
        {
            tweet: tweetId,
            likedBy: req.user._id
        }
    )

    const likedTweet = await Like.findById(like._id)
    if (!likedTweet)
        throw new ApiError(500, "Something went wrong while liking the tweet")

    return res.status(200).json(
        new ApiResponse(
            200,
            likedTweet,
            "Like added successfully"
        )
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find(
        {
            likedBy: req.user._id,
            video: { $exists: true }
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            likedVideos,
            "All liked videos fetched successfully"
        )
    )
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}