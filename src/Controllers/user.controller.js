import asyncHandler from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/ApiError.js"
import { User } from "../Models/user.model.js"
import { deleteImageFromCloudinary, uploadOnCloudinary } from "../Utils/cloudinary.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens.")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //1. Get user details from frontend.
    //2. Validation - not empty, etc.
    //3. Check if user already exist: from username, email
    //4. check for images, check for avatar.
    //5. Upload them to cloudinary, check avatar.
    //6. create user object - create entry in db.
    //7. remove password and refresh token field from token.
    //8. Check for user creation.
    //9. return response.

    //step-1
    const { fullname, username, email, password } = req.body;


    //step-2
    if (
        [fullname, email, password, username].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are Required.")
    }

    if (!email?.includes('@')) {
        throw new ApiError(401, "Email is not in proper format.")
    }

    if (password.trim().length < 5) {
        throw new ApiError(402, "Password must contain 6 or more characters.")
    }

    //step-3
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with same username or email already exists.")
    }

    //step-4
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.")
    }

    //step-5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required.")
    }

    //step-6
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //step-7
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //step-8
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    //step-9
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // 1.Get data from req body.
    // 2.username and email check
    // 3.find the user.
    // 4.password check.
    // 5.access and refresh token.
    // 6.send cookie.

    // step - 1
    const { email, username, password } = req.body

    //step - 2
    if (!username && !email) {
        throw new ApiError(400, "Email or Username is required.")
    }

    //step - 3
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(401, "User does not exist.")
    }

    //step - 4
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(402, "Password is invalid.")
    }

    //step - 5
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    //step - 6
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    refreshToken,
                    accessToken
                },
                "User logged In successfully."
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 //to remove this field from document.
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        clearCookie("accessToken", options).
        clearCookie("refreshToken", options).
        json(
            new ApiResponse(200, {}, "User logged out.")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    //to get refresh token from user
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refereshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }


    try {
        //to decode refresh token and find user
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refereshToken) {
            throw new ApiError(401, "Refresh token is expired or used.")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200).
            cookie("accessToken", accessToken, options).
            cookie("refreshToken", newRefreshToken, options).
            json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed."
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?.id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password")
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false })

    return res.status(200).
        json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully."
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).
        json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully."
            )
        )
})

const updateAccountDetails = asyncHandler(async (req, res) => {

    const { fullname, email } = req.body

    if (!fullname && !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Account details updated successfully."
        )
    )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(401, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    // To delete old avatar
    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(400, "Unauthorized request");
    }

    if (user.avatar) {
        const response = await deleteImageFromCloudinary(user.avatar);

        if (!response) {
            throw new ApiError(400, "Old Avatar does not found.");
        }
    }

    // Update user's avatar with the new URL
    user.avatar = avatar.url;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            // user.select("-password -refreshToken"),
            user,
            "Avatar updated successfully."
        )
    );
});


const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(401, "Cover Image is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage) {
        throw new ApiError(400, "Error while uploading cover image")
    }

    //To delete old cover image.
    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(400, "Unauthorized request")
    }

    const response = await deleteImageFromCloudinary(user.coverImage)

    if (!response) {
        throw new ApiError(400, "Old cover image does not found.")
    }

    user.coverImage = coverImage.url
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Cover Image updated successfully."
        )
    )

})

const getUserChannelDetails = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        //to find documents with given username
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        // to find subscribers
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        //to find whom you have subscribed
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        //to add temporary fields
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        //to get required fields
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exist")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            channel[0],
            "User channel fetched successfully"
        )
    )
})

const getWatchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export {
    registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails,
    updateUserAvatar, updateCoverImage, getUserChannelDetails, getWatchHistory
}