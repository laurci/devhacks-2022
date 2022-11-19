import { debug } from "@meta/debug";
import Net from "net";
import ENV from "./env";

import { SmartObject } from "./object";

export type OnNewSmartObject = (obj: SmartObject) => void;

const listeners = new Set<OnNewSmartObject>();

const server = Net.createServer((socket) => {
    // create smart object
    const obj = new SmartObject(socket);

    // call onNewSmartObject
    for (const listener of listeners) {
        listener(obj);
    }
});

export function startServer() {
    server.listen(ENV.server.port, ENV.server.host, function onServerStart() {
        debug!("Started server", ENV.server.port, ENV.server.port);
    });
}
