import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";
import { Subscription } from "../Models/subscription.model.js"

const toggleSubscriptionStatus = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId)
        throw new ApiError(400, "Channel id is required")

    const isSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })

    if (isSubscribed) {
        await isSubscribed.deleteOne()
        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Subscription removed successfully"
            )
        )
    }

    const createdSubscription = await Subscription.create(
        {
            subscriber: req.user.id,
            channel: channelId
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            createdSubscription,
            "Subscription added successfully"
        )
    )

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId)
        throw new ApiError(400, "Channel id is required")

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "fullname email username avatar coverImage")

    return res.status(200).json(
        new ApiResponse(
            200,
            { subscribers },
            "All subscribers fetched successfully"
        )
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId)
        throw new ApiError(400, "Subscriber id is required")

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId }).populate("channel", "fullname email username avatar coverImage");

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels are fetched successfully"
        )
    )
})

export {
    toggleSubscriptionStatus,
    getUserChannelSubscribers,
    getSubscribedChannels
}