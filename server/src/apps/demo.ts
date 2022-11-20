import { actor, message } from "@meta/actor";
import { app } from "@meta/app";
import { debug } from "@meta/debug";
import { EnterRectangularZoneMessage, LeaveRectangularZoneMessage, RectangularZone } from "../lib/components/zone";
import { Vector2 } from "../lib/math";
import { BaseComponent, Car, Junction } from "../lib/actor";
import { PositionUpdateMessage } from "../lib/broker";

export default app!(() => {
    actor!<Junction>(self => {
        self.addComponent(RectangularZone, {
            position: new Vector2(500, 300),
            dimensions: new Vector2(250, 100),
        });

        message!((message) => {
            if (message instanceof PositionUpdateMessage) {
                debug!(message.type, message.position);
            }

            if (message instanceof EnterRectangularZoneMessage) {
                debug!(message.type, message.zone.actorsCount);
            }

            if (message instanceof LeaveRectangularZoneMessage) {
                debug!(message.type, message.zone.actorsCount);
            }
        });

        message!<EnterRectangularZoneMessage>(msg => {
            if (!(msg.emitter instanceof Car)) return;

            if (msg.zone.actorsCount > 2) {
                self.switch("green");
            }
        });

        message!<LeaveRectangularZoneMessage>(msg => {
            if (!(msg.emitter instanceof Car)) return;

            if (msg.zone.actorsCount <= 2) {
                self.switch("red");
            }
        });
    });
});
