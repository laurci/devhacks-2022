import { uint32 } from "./types";

/**
 * @packer {id: 0xf1}
 */
export interface TestPacket {
    a: uint32;
    b: uint32;
}
