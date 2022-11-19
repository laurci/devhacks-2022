import { debug } from "@meta/debug";
import { AsyncLocalStorage } from "async_hooks";
import { Vector2 } from "./math";

export interface BaseActor {
    id: number;
    type: keyof Actors;
    position: Vector2;
}

export interface LandmarkActor {
}

export interface CarActor extends BaseActor {
    type: "car";
}

export interface SemaphoreActor extends BaseActor, LandmarkActor {
    type: "semaphore";
}

export type Actors = {
    "car": CarActor,
    "semaphore": SemaphoreActor,
}

export type AllActors = Actors[keyof Actors];

export interface BaseEvent {
    type: keyof ActorEvents;
}

export interface UpdateEvent extends BaseEvent {
    type: "update"
}

export type ActorEvents = {
    update: UpdateEvent,
}

export type AllActorEvents = ActorEvents[keyof ActorEvents];


class ActorManager {
    private actorIdStorage = new AsyncLocalStorage<string>();

    private actors = new Map<string, AllActors>();
    private actorHandlers = new Map<string, (actor: BaseActor) => void>();
    private actorEventHandlers = new Map<string, (ev: AllActorEvents) => void | Promise<void>>();

    public bindActorHandler(type: string, handler: (actor: BaseActor) => void) {
        this.actorHandlers.set(type, handler);
    }

    public getActorId(actor: { id: number, type: string }) {
        return `${actor.type}:${actor.id}`;
    }

    public initActor(actor: AllActors) {
        const actorId = this.getActorId(actor);
        this.actors.set(actorId, actor);

        const handler = this.actorHandlers.get(actor.type);
        if (!handler) {
            debug!("No handler registered", actor.type);
            return;
        }

        this.runWithActorId(actorId, () => {
            handler(actor);
        });
    }

    public getActor<T extends keyof Actors>(type: T, id: number): Actors[T] {
        const actorId = this.getActorId({ type, id });
        const actor = this.actors.get(actorId);
        if (!actor) {
            throw new Error(`Actor ${actorId} not found`);
        }

        return actor as Actors[T];
    }

    public bindActorEventHandler(type: string, handler: (ev: AllActorEvents) => void | Promise<void>) {
        const actorId = this.getCurrentActorId();
        const key = `${actorId}:${type}`;
        this.actorEventHandlers.set(key, handler);
    }

    public sendEventForActor(ev: AllActorEvents, actorId: string) {
        const key = `${actorId}:${ev.type}`;
        const handler = this.actorEventHandlers.get(key);
        if (!handler) {
            debug!("No handler registered", key);
            return;
        }
        handler(ev);
    }

    private async runWithActorId(id: string, fn: () => void) {
        this.actorIdStorage.run(id, fn);
    }

    public getCurrentActorId() {
        const actorType = this.actorIdStorage.getStore();
        if (!actorType) {
            throw new Error("Expected actorType to be set");
        }

        return actorType;
    }
}

export const actorManager = new ActorManager();

