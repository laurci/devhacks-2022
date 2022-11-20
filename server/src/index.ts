import "./lib/globals";

import { startRedis } from "./lib/redis";
import { startServer } from "./lib/server";
import { initApplications } from "./lib/manager";
import { debug } from "@meta/debug";
import { Vector2 } from "./lib/math";
import actorManager, { Car, Junction } from "./lib/actor";
import { PositionUpdateMessage } from "./lib/broker";
import { RectangularZone } from "./lib/components/zone";

async function main() {
    const applicationFilter = process.argv.length > 2 ? process.argv[2] : undefined;
    debug!(applicationFilter);

    await startRedis();

    await initApplications(applicationFilter);

    const junction = new Junction(
        new Vector2(0, 0),
    )

    junction.addComponent(RectangularZone, {
        position: new Vector2(0, 0),
        dimensions: new Vector2(10, 10)
    });
    actorManager.initActor(junction);

    const car = new Car(
        new Vector2(-5, -5)
    );
    const car2 = new Car(
        new Vector2(-5, -5)
    );

    const car3 = new Car(
        new Vector2(-5, -5)
    );


    actorManager.initActor(car);
    actorManager.initActor(car2);
    actorManager.initActor(car3);

    car.position = new Vector2(3, 3);
    actorManager.handleMessage(new PositionUpdateMessage(car));

    car2.position = new Vector2(7, 7);
    actorManager.handleMessage(new PositionUpdateMessage(car2));

    car3.position = new Vector2(8, 8);
    actorManager.handleMessage(new PositionUpdateMessage(car3));

    startServer();

    process.exit(1);
}

main();
