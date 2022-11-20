import { debug } from "@meta/debug";
import { v4 as uuid } from "uuid";

class Entity {
}

class JunctionApi {
    constructor(private world: World) {
    }
}

class CarApi {
    constructor(private world: World) {

    }
}

interface WorldApi {
    get junction(): JunctionApi;
    get car(): CarApi;
}

class World implements WorldApi {

    public junction = new JunctionApi(this);
    public car = new CarApi(this);
}

const world = new World();

declare global {
    var world: WorldApi;
}
(globalThis as any).world = world;

export default world;
