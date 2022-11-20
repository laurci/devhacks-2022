import { packer } from "@meta/packer";
import { InitActorFrame, InitBeginFrame } from "./init.proto";
import { TestPacket } from "./test.proto";

const proto = {
    test: packer!<TestPacket>(),
    init: {
        begin: packer!<InitBeginFrame>(),
        actor: packer!<InitActorFrame>(),
    }
} as const;

export default proto;

export {
    TestPacket
};
