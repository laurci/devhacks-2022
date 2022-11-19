import { LandmarkActor } from "./actor";
import { Vector2 } from "./math";

export interface WorldApi {
    defineZone(position: Vector2, radius: number): void;
    getPositionOfLandmark(landmark: LandmarkActor): Vector2;
}

class World implements WorldApi {
    defineZone(position: Vector2, radius: number) {
        console.log("defineZone", position, radius);
    }

    getPositionOfLandmark(landmark: LandmarkActor): Vector2 {
        return new Vector2(0, 0);
    }
}

const world = new World();
export const worldManager = world;

export default world as WorldApi;
