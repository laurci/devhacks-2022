import { debug } from "@meta/debug";
import { BaseActor, BaseComponent } from "../actor";
import { BaseMessage, PositionUpdateMessage } from "../broker";
import { Vector2 } from "../math";

export class EnterRectangularZoneMessage extends BaseMessage<"rect_zone_enter"> {
    constructor(emitter: BaseActor, public zone: RectangularZone) {
        super("rect_zone_enter", emitter);
    }
}

export class LeaveRectangularZoneMessage extends BaseMessage<"rect_zone_leave"> {
    constructor(emitter: BaseActor, public zone: RectangularZone) {
        super("rect_zone_leave", emitter);
    }
}

export class RectangularZone extends BaseComponent<{ position: Vector2, dimensions: Vector2 }> {
    private containedActors = new Set<BaseActor>();

    public get actorsCount() {
        return this.containedActors.size;
    }

    private isInside(position: Vector2) {
        const { position: zonePosition, dimensions: zoneDimensions } = this.options;
        return position.x >= zonePosition.x && position.x <= zonePosition.x + zoneDimensions.x && position.y >= zonePosition.y && position.y <= zonePosition.y + zoneDimensions.y;
    }

    handleMessage(message: BaseMessage): void {
        if (message instanceof PositionUpdateMessage) {
            if (this.containedActors.has(message.emitter)) {
                if (!this.isInside(message.position)) {
                    this.containedActors.delete(message.emitter);
                    this.actor.handleMessage(new LeaveRectangularZoneMessage(message.emitter, this));
                }
            } else {
                if (this.isInside(message.position)) {
                    this.containedActors.add(message.emitter);
                    this.actor.handleMessage(new EnterRectangularZoneMessage(message.emitter, this));
                }
            }
        }
    }

}
