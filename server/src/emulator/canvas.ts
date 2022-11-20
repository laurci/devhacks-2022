const canvasElement = document.getElementById("root") as HTMLCanvasElement;

export const WIDTH = canvasElement.width = 1280;
export const HEIGHT = canvasElement.height = 720;

const canvas = canvasElement.getContext("2d")!;


canvas.arc(100, 100, 50, 0, 2 * Math.PI);
canvas.stroke();
canvas.fill();
