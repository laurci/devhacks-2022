import { debug } from "@meta/debug";
import Ws from "ws";
import proto from "../protocol";
import actorManager, { BaseActor, Car, Junction } from "./actor";
import ENV from "./env";
import { Vector2 } from "./math";
import { processSocketMessage } from "./processor";

enum InitPhase {
    None,
    Init,
    Ready,
}

export function startServer() {
    const wss = new Ws.Server({ port: ENV.server.port, host: ENV.server.host });
    wss.on("connection", (socket) => {
        debug!("new connection");
        socket.binaryType = "arraybuffer";

        let initPhase = InitPhase.None;

        if (initPhase == InitPhase.None) {
            socket.send(new Uint8Array([proto.init.begin.id]).buffer);
            initPhase = InitPhase.Init;
        }

        let actor: BaseActor;

        setTimeout(() => {
            console.log("send test");
            actor.send(proto.test.pack({ a: 11, b: 22 }));
        }, 10_000);

        socket.on("message", (data: ArrayBuffer) => {
            if (initPhase == InitPhase.Ready) {
                if (actor) {
                    processSocketMessage(actor, data);
                }
            } else {
                const arr = new Uint8Array(data);
                if (arr[0] == proto.init.actor.id) {
                    const packet = proto.init.actor.unpack(data, 1);
                    debug!("init actor", packet);

                    if (packet.type == 0x00) {
                        actor = new Junction(new Vector2(+packet.pos_x, +packet.pos_y));
                        actorManager.initActor(actor);
                    } else if (packet.type == 0x01) {
                        actor = new Car(new Vector2(+packet.pos_x, +packet.pos_y));
                        actorManager.initActor(actor);
                    }

                    if (actor) {
                        actor.bindSocket(socket);
                    }

                    initPhase = InitPhase.Ready;
                }
            }
        });
    });

    debug!("Started server", ENV.server.port, ENV.server.port);
}
