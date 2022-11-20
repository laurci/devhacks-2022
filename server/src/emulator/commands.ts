import proto from "../protocol";
import { data } from "./data";

export function setLight(color: "red" | "green" | "yellow") {
    data.light.color = color;
}

export function setCarPosition(carIdx: number, x: number, y: number) {
    data.cars[carIdx].x = x;
    data.cars[carIdx].y = y;
    data.cars[carIdx].socket.send(proto.car.positionChange.pack({
        x,
        y
    }));
}
