import { map } from "./layers/map";

const canvasElement = document.getElementById("root") as HTMLCanvasElement;

export const WIDTH = canvasElement.width = 1280;
export const HEIGHT = canvasElement.height = 720;

const canvas = canvasElement.getContext("2d")!;

const layers = [
    map
];

function draw() {
    for (const layer of layers) {
        layer(canvas);
    }

    requestAnimationFrame(draw)
}

draw();
