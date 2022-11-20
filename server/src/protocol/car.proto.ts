import { uint8, uint32 } from "./types";

/**
 * @packer {id: 0x03}
 */
export interface PositionChangeFrame {
    x: uint32;
    y: uint32;
}

