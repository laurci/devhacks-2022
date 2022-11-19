import * as path from "path";
import { config as configDotEnv } from "dotenv";
import { inspect } from "util";
import struct from "./struct";
import { actorManager } from "./actor";

const isProductionRuntime = process.env.NODE_ENV === "production";

if (!isProductionRuntime) {
    configDotEnv();
}

function withGlobal<T>(key: string, value?: unknown): T | undefined {
    const fullKey = `__${key}`;
    if (typeof value == "undefined") {
        return (globalThis as unknown as Record<string, unknown>)[fullKey] as T;
    }

    (globalThis as unknown as Record<string, unknown>)[fullKey] = value;
}
(globalThis as unknown as Record<string, unknown>)["_with_global"] = withGlobal;

withGlobal("path_relative_to_file", (baseDir: string, relativePath: string) => {
    return path.join(baseDir, relativePath);
});

type LogArg = string | { type: "expression"; value: unknown; text: string };

withGlobal("debug_log", (...args: LogArg[]) => {
    for (const arg of args) {
        if (typeof arg === "string") {
            process.stdout.write(arg);
        }

        if (typeof arg == "object") {
            process.stdout.write("(");
            process.stdout.write(arg.text);
            process.stdout.write(" = ");
            if (typeof arg.value == "object" && typeof (arg.value as any)?.["debugPrint"] == "function") {
                process.stdout.write((arg.value as any).debugPrint());
            } else {
                process.stdout.write(inspect(arg.value, {
                    colors: true
                }));
            }
            process.stdout.write(")");
        }

        process.stdout.write(" ");
    }

    process.stdout.write("\n");
});

withGlobal("make_packer", (formatString: string, propsOrder: string[]) => {
    const str = struct(formatString);

    return {
        pack(value: unknown) {
            const values = propsOrder.map(p => (value as any)[p]);
            return str.pack(...values);
        },
        unpack(buffer: Buffer, offset = 0): unknown {
            const values = str.unpack(buffer, offset);
            const result: Record<string, unknown> = {};
            for (let i = 0; i < propsOrder.length; i++) {
                result[propsOrder[i]] = values[i];
            }
            return result;
        }
    }
});

withGlobal("load_app_from", (baseDir: string, relativePath: string) => {
    const basePath = require.resolve(relativePath, { paths: [baseDir] });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(basePath);
    return {
        name: relativePath.split("/").pop() ?? "unknown",
        mod: mod.default
    };
});

withGlobal("init_app", (factory: () => void | Promise<void>) => {
    return factory;
});

withGlobal("make_actor_type", (type: string, factory: () => void | Promise<void>) => {
    actorManager.bindActorHandler(type, factory);
});

withGlobal("actor_event", (type: string, handler: () => void | Promise<void>) => {
    actorManager.bindActorEventHandler(type, handler);
});
