import { debug } from "@meta/debug";
import proto from "../protocol";
import { BaseActor } from "./actor";

export function processSocketMessage(actor: BaseActor, buffer: ArrayBuffer) {
    const data = new Uint8Array(buffer);
    const packetId = data[0];

    switch (packetId) {
        case proto.test.id: {
            const packet = proto.test.unpack(buffer, 1);
            debug!(packet);

            break;
        }

        default:
            debug!("unknown packet", packetId);
    }
}
