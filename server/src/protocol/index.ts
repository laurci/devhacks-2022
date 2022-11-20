import { packer } from "@meta/packer";
import { TestCanFrame } from "./can.proto";
import { InitActorFrame, InitBeginFrame } from "./init.proto";
import { TestPacket } from "./test.proto";

const proto = {
    test: packer!<TestPacket>(),
    init: {
        begin: packer!<InitBeginFrame>(),
        actor: packer!<InitActorFrame>(),
    },
    can: {
        test: packer!<TestCanFrame>()
    }
} as const;

export default proto;

export {
    TestPacket
};
