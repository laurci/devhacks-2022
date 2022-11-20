import "../lib/web-globals";
import "./canvas";
import { setCarPosition } from "./commands";
import { data, MAIN_LANE_1_Y } from "./data";
import { setupSerial } from "./serial";
import { createSocket } from "./ws";
import proto from "../protocol";


createSocket("junction", 0, 650, 310, (val) => {
    const arr = new Uint8Array(val);
    const packetId = arr[0];

    switch (packetId) {
        case proto.junction.change.id: {
            const packet = proto.junction.change.unpack(val, 1);

            const color = packet.color == 0x00 ? "red" : packet.color == 0x01 ? "green" : "yellow";
            data.light.color = color;

            break;
        }
    }
});

window.onkeyup = (event) => {
    switch (event.key) {
        case "s":
            setupSerial();
            break;

        case "1":
            setCarPosition(0, 750, MAIN_LANE_1_Y);
            break;

        case "2":
            setCarPosition(1, 680, MAIN_LANE_1_Y);
            break;

        case "3":
            setCarPosition(2, 600, MAIN_LANE_1_Y);
            break;

        case "4":
            setCarPosition(2, 100, MAIN_LANE_1_Y);
            break;

    }
};

for (let car of data.cars) {

}
