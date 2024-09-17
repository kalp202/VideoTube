import asyncHandler from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { Comment } from "../Models/comment.model.js"

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId)
        throw new ApiError(400, "Video not found")

    const { content } = req.body
    if (content.trim() === "")
        throw new ApiError(400, "Content is required")

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    const createdComment = await Comment.findById(comment._id)
    if (!createdComment)
        throw new ApiError(401, "Something went wrong while adding comment")

    return res.status(200).json(
        new ApiResponse(
            200,
            createdComment,
            "Comment added successfully"
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId)
        throw new ApiError(400, "Comment not found")

    const { content } = req.body
    if (content.trim() === "")
        throw new ApiError(400, "Content is required")

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )
    if (!comment)
        throw new ApiError(500, "Somethinf went wrong while updating comment")

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId)
        throw new ApiError(400, "Comment not found")

    const deletedComment = await Comment.findByIdAndDelete(commentId)
    if (!deleteComment)
        throw new ApiError(400, "Comment not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedComment,
            "Comment deleted successfully"
        )
    )
})

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId)
        throw new ApiError(400, "Video id is required")

    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    const comments = await Comment.find({ video: videoId }).skip(skip).limit(limit)

    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "All comments fetched successfully"
        )
    )
})

export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}