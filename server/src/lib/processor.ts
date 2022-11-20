import { debug } from "@meta/debug";
import proto from "../protocol";
import actorManager, { BaseActor } from "./actor";
import { PositionUpdateMessage } from "./broker";
import { Vector2 } from "./math";

export function processSocketMessage(actor: BaseActor, buffer: ArrayBuffer) {
    const data = new Uint8Array(buffer);
    const packetId = data[0];

    switch (packetId) {
        case proto.test.id: {
            const packet = proto.test.unpack(buffer, 1);
            debug!(packet);

            break;
        }

        case proto.car.positionChange.id: {
            const packet = proto.car.positionChange.unpack(buffer, 1);
            actor.position = new Vector2(+packet.x, +packet.y);
            actorManager.handleMessage(new PositionUpdateMessage(actor));

            break;
        }

        default:
            debug!("unknown packet", packetId);
    }
}
