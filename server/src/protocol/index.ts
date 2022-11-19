import { packer } from "@meta/packer";
import { TestPacket } from "./test.proto";

const proto = {
    test: packer!<TestPacket>()
} as const;

export default proto;

export {
    TestPacket
};
