import { uint8 } from "./types";

/**
 * @packer {id: 0x01}
 */
export interface TestPacket {
    a: uint8;
    b: uint8;
}
