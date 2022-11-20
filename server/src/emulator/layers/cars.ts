import { HEIGHT, WIDTH } from "../canvas";
import { data } from "../data";
import { ROAD_WIDTH } from "./roads";

const CAR_WIDTH = 60;
const CAR_HEIGHT = 30;

export function cars(canvas: CanvasRenderingContext2D) {
    for (let car of data.cars) {
        canvas.fillStyle = car.color;
        canvas.fillRect(car.x - CAR_WIDTH / 2, car.y - CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
    }
}
