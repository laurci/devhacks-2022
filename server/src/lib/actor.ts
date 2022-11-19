import { Vector2 } from "./math";

export interface BaseActor {
}

export interface LandmarkActor {
    id: string;
}


export interface CarActor extends BaseActor {
    position: Vector2;
}

export interface SemaphoreActor extends LandmarkActor {

}

export type Actors = {
    "car": CarActor,
    "semaphore": SemaphoreActor,
}
