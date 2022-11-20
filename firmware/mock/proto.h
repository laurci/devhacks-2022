// This code was generated from .proto.ts files.
// Do not edit this file directly if you don't know what you're doing.
// To regenerate this file, run "yarn proto:exportc" in the root directory.

#include <stdint.h>

typedef struct {
} InitBeginFrame;
#define ID_INIT_BEGIN_FRAME 1

typedef struct {
    uint8_t type;
    uint8_t id;
    uint32_t pos_x;
    uint32_t pos_y;
} InitActorFrame;
#define ID_INIT_ACTOR_FRAME 2

typedef struct {
    uint8_t a;
    uint8_t b;
} TestPacket;
#define ID_TEST_PACKET 241

