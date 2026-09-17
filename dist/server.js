//main file
import "dotenv/config";
import { createApp } from "./app.js";
import { logger } from "./libs/logger.js";
const server = createApp();
const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});
