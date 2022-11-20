import { HEIGHT, WIDTH } from "../canvas";
import { ROAD_WIDTH } from "./roads";

const SCHOOL_WIDTH = 200;
const SCHOOL_HEIGHT = 100;
const SCHOOL_SPACING = 50;

export function buildings(canvas: CanvasRenderingContext2D) {
    canvas.fillStyle = "brown";
    canvas.fillRect((WIDTH * 1 / 3), (HEIGHT / 2) - SCHOOL_HEIGHT - SCHOOL_SPACING, SCHOOL_WIDTH, SCHOOL_HEIGHT);
}
