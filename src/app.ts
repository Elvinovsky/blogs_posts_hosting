import { runDb } from "./database/runDB";
import { startServer } from "./settings";

const startApp = async () => {
    await runDb();
    await startServer();
};

startApp()
