import { uint8, uint32 } from "./types";

/**
 * @packer {id: 0x01}
 */
export interface InitBeginFrame { }

/**
 * @packer {id: 0x02}
 */
export interface InitActorFrame {
    type: uint32; // 0 = junction, 1 = car
    id: uint32;
    pos_x: uint32;
    pos_y: uint32;
}
