import "./lib/globals";

import { startRedis } from "./lib/redis";
import { startServer } from "./lib/server";
import { initApplications } from "./lib/manager";
import { debug } from "@meta/debug";
import { actorManager, CarActor } from "./lib/actor";
import { Vector2 } from "./lib/math";

async function main() {
    const applicationFilter = process.argv.length > 2 ? process.argv[2] : undefined;
    debug!(applicationFilter);

    await startRedis();

    await initApplications(applicationFilter);

    const testActor: CarActor = {
        id: 1,
        type: "car",
        position: new Vector2(0, 0)
    };

    actorManager.initActor(testActor);

    actorManager.sendEventForActor({
        type: "update",
    }, actorManager.getActorId(testActor));

    const actor = actorManager.getActor("car", 1);
    actor.position = new Vector2(1, 1);

    actorManager.sendEventForActor({
        type: "update",
    }, actorManager.getActorId(testActor));

    startServer();

    process.exit(1);
}

main();
