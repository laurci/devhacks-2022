import proto from "../protocol";

const url = "wss://iot.laur.remote.flowos.dev/";

export function createSocket(type: "car" | "junction", id: number, pos_x: number, pos_y: number, handler: (data: ArrayBuffer) => void) {
    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer";
    socket.onmessage = (event) => {
        const arr = new Uint8Array(event.data);
        const packetId = arr[0];
        if (packetId === proto.init.begin.id) {
            socket.send(proto.init.actor.pack({
                type: type == "car" ? 0x01 : 0x00,
                id,
                pos_x,
                pos_y
            }));

            return;
        }
        handler(event.data);
    };
    return socket;
}
