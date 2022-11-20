import { actor, message } from "@meta/actor";
import { app } from "@meta/app";
import { debug } from "@meta/debug";
import { EnterRectangularZoneMessage, LeaveRectangularZoneMessage } from "../lib/components/zone";
import { Vector2 } from "../lib/math";
import { BaseComponent, Car, Junction } from "../lib/actor";

export default app!(() => {
    actor!<Junction>(self => {
        message!<EnterRectangularZoneMessage>(msg => {
            if (!(msg.emitter instanceof Car)) return;

            if (msg.zone.actorsCount > 2) {
                debug!("Junction is full!");
            }
        });

        message!<LeaveRectangularZoneMessage>(msg => {
            if (!(msg.emitter instanceof Car)) return;

            if (msg.zone.actorsCount <= 2) {
                debug!("Junction is not full!");
            }
        });
    });

    actor!<Car>(self => {
    });
});
