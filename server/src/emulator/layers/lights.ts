import { HEIGHT, WIDTH } from "../canvas";
import { data } from "../data";
import { ROAD_WIDTH } from "./roads";

const ROAD_SPACING = 10;
const LIGHT_WIDTH = 20;

export function lights(canvas: CanvasRenderingContext2D) {
    canvas.fillStyle = data.light.color;
    canvas.fillRect((WIDTH * 2 / 3) - ROAD_WIDTH / 2 - ROAD_SPACING - LIGHT_WIDTH, (HEIGHT / 2) + ROAD_WIDTH / 2 + ROAD_SPACING, LIGHT_WIDTH, LIGHT_WIDTH);
}
