import { ArrowFunction, Block, FunctionExpression, FunctionMacro, isArrowFunction, isFunctionExpression, NodeFactory, UsingMacro } from "compiler";
import { Actors } from "../lib/actor";
import { getGlobalInvokeExpression } from "./lib";

export macro function actor<T extends keyof Actors>(this: FunctionMacro, _actorType: T, _handler_func: (self: Actors[T]) => void) {
    this.transform(({ node, factory }) => {
        node.replace(getGlobalInvokeExpression(factory, "make_actor_type", [node.arguments[0], node.arguments[1]]));
    });
}

function actorEventHandler(factory: NodeFactory, name: string, body: FunctionExpression | ArrowFunction) {
    return getGlobalInvokeExpression(factory, "actor_event", [
        factory.createStringLiteral(name),
        body
    ])
}

export macro function update(this: FunctionMacro, _handler: () => Promise<void> | void) {
    this.transform(({ node, factory }) => {
        const firstArg = node.arguments[0];
        if (!isFunctionExpression(firstArg) && !isArrowFunction(firstArg)) {
            throw new Error("update!() must be called with a function expression");
        }

        node.replace(actorEventHandler(factory, "update", firstArg));
    });
}


export macro function enterZone(this: FunctionMacro, _handler: () => Promise<void> | void) {
    this.transform(({ node, factory }) => {
        const firstArg = node.arguments[0];
        if (!isFunctionExpression(firstArg) && !isArrowFunction(firstArg)) {
            throw new Error("enterZone!() must be called with a function expression");
        }

        node.replace(actorEventHandler(factory, "zone_enter", firstArg));
    });
}

export macro function leaveZone(this: FunctionMacro, _handler: () => Promise<void> | void) {
    this.transform(({ node, factory }) => {
        const firstArg = node.arguments[0];
        if (!isFunctionExpression(firstArg) && !isArrowFunction(firstArg)) {
            throw new Error("leaveZone!() must be called with a function expression");
        }

        node.replace(actorEventHandler(factory, "zone_leave", firstArg));
    });
}
