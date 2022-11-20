import { uint8 } from "./types";

/**
 * @packer {id: 0xf1}
 */
export interface TestPacket {
    a: uint8;
    b: uint8;
}
