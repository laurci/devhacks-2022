import { createSocket } from "./ws";

export const MAIN_LANE_1_Y = 385;

export const data = {
    light: {
        color: "red",
    },
    cars: [
        {
            color: "red",
            x: 0,
            y: MAIN_LANE_1_Y,
            socket: createSocket("car", 0, 0, MAIN_LANE_1_Y, () => { })
        },
        {
            color: "blue",
            x: 70,
            y: MAIN_LANE_1_Y,
            socket: createSocket("car", 0, 70, MAIN_LANE_1_Y, () => { })
        },
        {
            color: "green",
            x: 140,
            y: MAIN_LANE_1_Y,
            socket: createSocket("car", 0, 140, MAIN_LANE_1_Y, () => { })
        }
    ]
};
