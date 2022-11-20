import struct from "./struct";
import inspect from 'browser-util-inspect';

export function withGlobal<T>(key: string, value?: unknown): T | undefined {
    const fullKey = `__${key}`;
    if (typeof value == "undefined") {
        return (globalThis as unknown as Record<string, unknown>)[fullKey] as T;
    }

    (globalThis as unknown as Record<string, unknown>)[fullKey] = value;
}
(globalThis as unknown as Record<string, unknown>)["_with_global"] = withGlobal;

type LogArg = string | { type: "expression"; value: unknown; text: string };

withGlobal("debug_log", (...args: LogArg[]) => {
    let text = "";
    for (const arg of args) {
        if (typeof arg === "string") {
            text += arg;
        }

        if (typeof arg == "object") {
            text += "(";
            text += arg.text;
            text += " = ";
            if (typeof arg.value == "object" && typeof (arg.value as any)?.["debugPrint"] == "function") {
                text += (arg.value as any).debugPrint();
            } else {
                text += inspect(arg.value, {
                    colors: true
                });
            }
            text += ")";
        }

        text += " ";
    }

    console.log(text);
});

withGlobal("make_packer", (id: number, formatString: string, propsOrder: string[]) => {
    const str = struct(formatString);

    return {
        id,
        pack(value: unknown) {
            const values = propsOrder.map(p => (value as any)[p]);
            const data = new Uint8Array(str.pack(...values));
            return new Uint8Array([id, ...data]).buffer;
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
