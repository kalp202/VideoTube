import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { healthCheck } from "../Controllers/healthcheck.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/").get(healthCheck)


export default router