import asyncHandler from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Tweet } from "../Models/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content)
        throw new ApiError(400, "Content is required")

    const tweet = await Tweet.create(
        {
            owner: req.user._id,
            content
        }
    )

    const createdTweet = await Tweet.findById(tweet._id)
    if (!createdTweet)
        throw new ApiError(500, "Something went wrong while creating tweet")

    return res.status(200).json(
        new ApiResponse(
            200,
            createdTweet,
            "Tweet added successfully"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId)
        throw new ApiError(400, "tweet not found")

    const { content } = req.body
    if (!content)
        throw new ApiError(400, "Content is required")

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        },
        { new: true }
    )
    if (!updatedTweet)
        throw new ApiError(500, "Something went wrong while creating tweet")

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId)
        throw new ApiError(400, "Tweet not found")

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    if (!deletedTweet)
        throw new ApiError(500, "Something went wrong while deleting tweet")

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedTweet,
            "Tweet deleted successfully"
        )
    )
})

const getUserTweet = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find(
        { owner: req.user._id }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "All tweets fetched successfully"
        )
    )
})

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweet
}