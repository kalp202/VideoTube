import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from "./Routes/user.routes.js"
import videoRouter from "./Routes/video.routes.js"
import commentRouter from "./Routes/comment.routes.js"
import likeRouter from "./Routes/like.routes.js"
import healthCheckRouter from "./Routes/healthCheck.routes.js"
import playListRouter from "./Routes/playlist.routes.js"
import tweetRouter from "./Routes/tweet.routes.js"
import subscriptionRoutes from "./Routes/subscription.routes.js"
import dashboardRoutes from "./Routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/playlists", playListRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

export { app }