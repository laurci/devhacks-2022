import { HEIGHT, WIDTH } from "../canvas";

export const ROAD_WIDTH = 90;
export const BAND_WIDTH = 10;

export function roads(canvas: CanvasRenderingContext2D) {
    canvas.fillStyle = "black";
    canvas.fillRect(0, HEIGHT / 2 - ROAD_WIDTH / 2, WIDTH, ROAD_WIDTH);

    canvas.fillStyle = "white";
    canvas.fillRect(0, HEIGHT / 2 - BAND_WIDTH / 2, WIDTH, BAND_WIDTH);
    for (let i = 1; i < 50; i += 2) {
        canvas.fillStyle = "black";
        canvas.fillRect(i * 30, HEIGHT / 2 - BAND_WIDTH / 2, 10, BAND_WIDTH);
    }

    canvas.fillStyle = "black";
    canvas.fillRect((WIDTH * 2 / 3) - ROAD_WIDTH / 2, 0, ROAD_WIDTH, HEIGHT);

    canvas.fillStyle = "white";
    canvas.fillRect((WIDTH * 2 / 3) - BAND_WIDTH / 2, 0, BAND_WIDTH, HEIGHT);
    for (let i = 1; i < 50; i += 2) {
        canvas.fillStyle = "black";
        canvas.fillRect((WIDTH * 2 / 3) - BAND_WIDTH / 2, i * 30, BAND_WIDTH, 10);
    }

    canvas.fillStyle = "black";
    canvas.fillRect((WIDTH * 2 / 3) - ROAD_WIDTH / 2, HEIGHT / 2 - ROAD_WIDTH / 2, ROAD_WIDTH, ROAD_WIDTH);

    canvas.fillStyle = "white";
    canvas.fillRect((WIDTH * 2 / 3) - BAND_WIDTH / 2, HEIGHT / 2 - BAND_WIDTH / 2, BAND_WIDTH, BAND_WIDTH);
}
