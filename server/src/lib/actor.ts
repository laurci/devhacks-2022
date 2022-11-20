import { debug } from "@meta/debug";
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";
import { BaseMessage } from "./broker";
import ENV from "./env";
import { Vector2 } from "./math";

type MesasgeHandler = (message: BaseMessage) => void;


export abstract class BaseComponent<TOptions = void> {
    constructor(protected actor: BaseActor, protected options: TOptions) {

    }
    abstract handleMessage(message: BaseMessage): void;
}

type ComponentOptions<T> = T extends BaseComponent<infer TOptions> ? TOptions extends void ? never : TOptions : never;
type AddComponentArgs<T extends BaseComponent<any>> = ComponentOptions<T> extends void ? [component: { new(...args: any): T }] : [component: { new(...args: any): T }, options: ComponentOptions<T>];

export class BaseActor<TType = string> {
    public id = randomUUID();

    private components: BaseComponent[] = [];
    private handles: Map<string, Function> = new Map();

    protected constructor(
        public type: string,
        public position: Vector2,
    ) {

    }

    public addHandle(type: string, handle: MesasgeHandler) {
        this.handles.set(type, handle);
    }

    public addComponent<T extends BaseComponent<any>>(...options: AddComponentArgs<T>) {
        const [constructor, opts] = options;
        this.components.push(new constructor(this, opts));
    }

    public handleMessage(message: BaseMessage) {
        const handle = this.handles.get(message.type);
        if (handle) {
            handle(message);
        }

        const allHandle = this.handles.get("*");
        if (allHandle) {
            allHandle(message);
        }

        for (const component of this.components) {
            component.handleMessage(message);
        }
    }
}

export class Car extends BaseActor<"car"> {
    constructor(position: Vector2) {
        super("car", position);
    }
}

export class Junction extends BaseActor<"junction"> {
    constructor(position: Vector2) {
        super("junction", position);
    }
}

export type ActorHandler = (actor: BaseActor) => void;

class ActorManager {
    private actorIdStorage = new AsyncLocalStorage<string>();
    private actors: Map<string, BaseActor> = new Map();
    private actorHandlers = new Map<string, ActorHandler>();

    public getActorsInRadius(position: Vector2, radius: number) {
        const actors: BaseActor[] = [];
        for (const actor of this.actors.values()) {
            if (actor.position.inRadius(position, radius)) {
                actors.push(actor);
            }
        }
        return actors;
    }

    public initActor(actor: BaseActor) {
        this.actors.set(actor.id, actor);
        const handler = this.actorHandlers.get(actor.type);
        this.actorIdStorage.run(actor.id, () => {
            if (handler) {
                handler(actor);
            }
        });
    }

    public handleMessage(message: BaseMessage) {
        const actors = this.getActorsInRadius(message.position, ENV.distances.messageBroadcastRadius);
        for (const actor of actors) {
            actor.handleMessage(message);
        }
    }

    public bindActorHandler(type: string, handler: ActorHandler) {
        this.actorHandlers.set(type, handler);
    }

    public getCurrentActorId() {
        const id = this.actorIdStorage.getStore();
        if (!id) {
            throw new Error("No actor id set");
        }

        return id;
    }
}

const actorManager = new ActorManager();

export default actorManager;
