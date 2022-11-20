import { buildings } from "./layers/buildings";
import { cars } from "./layers/cars";
import { lights } from "./layers/lights";
import { map } from "./layers/map";
import { roads } from "./layers/roads";

const canvasElement = document.getElementById("root") as HTMLCanvasElement;

export const WIDTH = canvasElement.width = 1280;
export const HEIGHT = canvasElement.height = 720;

const canvas = canvasElement.getContext("2d")!;

const layers = [
    map,
    roads,
    lights,
    buildings,
    cars
];

function draw() {
    for (const layer of layers) {
        layer(canvas);
    }

    requestAnimationFrame(draw)
}

draw();
