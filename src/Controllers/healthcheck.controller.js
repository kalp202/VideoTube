import asyncHandler from "../Utils/asyncHandler.js"
import { ApiResponse } from "../Utils/ApiResponse.js"

const healthCheck = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Everything is working perfectly"
        )
    )
})

export {
    healthCheck
}