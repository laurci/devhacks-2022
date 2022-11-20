import "./lib/globals";

import { startRedis } from "./lib/redis";
import { startServer } from "./lib/server";
import { initApplications } from "./lib/manager";
import { debug } from "@meta/debug";

async function main() {
    const applicationFilter = process.argv.length > 2 ? process.argv[2] : undefined;
    debug!(applicationFilter);

    await startRedis();

    await initApplications(applicationFilter);

    startServer();
}

main();
