import { packer } from "@meta/packer";
import { TestCanFrame } from "./can.proto";
import { PositionChangeFrame } from "./car.proto";
import { InitActorFrame, InitBeginFrame } from "./init.proto";
import { JunctionChangeFrame } from "./junction.proto";
import { TestPacket } from "./test.proto";

const proto = {
    test: packer!<TestPacket>(),
    init: {
        begin: packer!<InitBeginFrame>(),
        actor: packer!<InitActorFrame>(),
    },
    can: {
        test: packer!<TestCanFrame>()
    },
    car: {
        positionChange: packer!<PositionChangeFrame>()
    },
    junction: {
        change: packer!<JunctionChangeFrame>()
    }
} as const;

export default proto;

export {
    TestPacket
};
