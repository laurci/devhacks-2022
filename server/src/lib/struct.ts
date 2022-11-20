import structjs from "@aksel/structjs";

export interface Struct {
    pack(...values: unknown[]): ArrayBuffer;
    unpack(buffer: ArrayBuffer, offset?: number): unknown[];
}

/**
 * format strings https://www.npmjs.com/package/@aksel/structjs#format-strings
 */
export default function struct(format: string): Struct {
    const str = structjs(format);
    return {
        pack: (...values: unknown[]) => str.pack(...values),
        unpack: (buffer: ArrayBuffer, offset?: number) => str.unpack_from(buffer, offset),
    }
}
