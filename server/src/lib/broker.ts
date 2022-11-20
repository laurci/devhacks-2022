import { BaseActor } from "./actor";
import { Vector2 } from "./math";
export class BaseMessage<TType = string> {
    public position: Vector2;
    constructor(
        public type: string,
        public emitter: BaseActor,
    ) {
        this.position = new Vector2(emitter.position.x, emitter.position.y);
    }

}

export class PositionUpdateMessage extends BaseMessage<"position_update"> {
    constructor(emitter: BaseActor, position?: Vector2) {
        super("position_update", emitter);
        if (position) {
            this.position = position;
        }
    }
}
