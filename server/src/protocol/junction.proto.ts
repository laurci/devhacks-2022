import { uint8, uint32 } from "./types";

/**
 * @packer {id: 0x04}
 */
export interface JunctionChangeFrame {
    color: uint32;
}

