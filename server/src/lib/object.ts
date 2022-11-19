import { Socket } from "net";

export class SmartObject {
    constructor(
        public socket: Socket,
    ) {
        socket.on("close", () => {
            // call on destory
        });
    }

}
