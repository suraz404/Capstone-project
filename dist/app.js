//express logic is written here
//express related anything is written here
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { apiRouter } from "./routes/index.js";
export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api", apiRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
