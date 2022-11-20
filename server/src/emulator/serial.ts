import proto from "../protocol";

export async function setupSerial() {
    const port = await navigator.serial.requestPort();
    if (!port) {
        console.log("Failed to get serial port");
    };

    await port.open({ baudRate: 9600 });

    const reader = port.readable!.getReader();

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            reader.releaseLock();
            break;
        }

        if (value[0] == 0xfe && value[1] == 0xef) {
            const packetId = value[2];

            switch (packetId) {
                case proto.can.test.id:
                    const testPacket = proto.can.test.unpack(value.buffer, 3);
                    console.log("Test packet: ", testPacket);
                    break;
            }
        }
    }
}

