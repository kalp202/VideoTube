//using async-await or try-catch
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        const statusCode =
            (typeof error.code === 'number' && error.code >= 100 && error.code < 600)
                ? error.code
                : 500; // Default to 500 for invalid or missing status codes

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};


//using promises
// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).
//         catch((err) => next(err))
//     }
// }

export default asyncHandler 