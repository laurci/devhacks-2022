import { HEIGHT, WIDTH } from "../canvas";

export function map(canvas: CanvasRenderingContext2D) {
    canvas.fillStyle = "darkgray";
    canvas.fillRect(0, 0, WIDTH, HEIGHT);
}
