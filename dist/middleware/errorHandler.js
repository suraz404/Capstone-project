import { logger } from "../libs/logger.js";
export function errorHandler(err, _req, res, _next) {
    logger.error({ err }, "Unhandle error");
    res.status(500).json({
        sucess: false,
        message: "Internal Server error",
    });
}
