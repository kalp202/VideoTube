import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import { Video } from "../Models/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    if (!req.user?._id)
        throw new ApiError(400, "Unauthorized request")

    const userId = req.user?._id

    const channelStats = await Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        //for subscriber of channel
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        //for subscribed channels
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        //for likes on video
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likedVideos"
            }
        },
        //for comments on video
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "videoComments"
            }
        },
        //for tweets by user
        {
            $lookup: {
                from: "tweets",
                localField: "owner",
                foreignField: "owner",
                as: "tweets"
            }
        },
        //Group to calculate
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                subscribers: { $first: "$subscribers" },
                subscribedTo: { $first: "$subscribedTo" },
                totalLikes: { $sum: "$likedVideos" },
                totalComments: { $sum: "$videoComments" },
                totalTweets: { $sum: "$tweets" }
            }
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1,
                subscribers: { $size: "$subscribers" },
                subscribedTo: { $size: "$subscribedTo" },
                totalLikes: 1,
                totalTweets: 1,
                totalComments: 1
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            channelStats[0],
            "Channel stats fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    if (!req.user?._id)
        throw new ApiError(400, "Unauthorized request")

    const userId = req.user?._id

    const allVideos = await Video.find({ owner: userId })

    return res.status(200).json(
        new ApiResponse(
            200,
            allVideos,
            "All videos fetched successfully"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}