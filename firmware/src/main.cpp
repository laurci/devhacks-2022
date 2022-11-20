#include <Arduino.h>

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <FastLED.h>

#include "pinmap.h"
#include "secrets.h"
#include "proto.h"

WebSocketsClient webSocket;

CRGB leds[1];

#define INIT_PACKET(name) (name*)initPacket(sizeof(name))

#define COLOR_RED 0xff, 0x00, 0x00
#define COLOR_PINK 0xff, 0x00, 0xff
#define COLOR_GREEN 0x00, 0xff, 0x00

void setLed(uint8_t red, uint8_t green, uint8_t blue) {
  leds[0] = CRGB(red, green, blue);
  FastLED.show();
}

boolean button() {
  if(!digitalRead(BUTTON_PIN)) {
    while(!digitalRead(BUTTON_PIN)) {
      delay(30);
    }
    return true;
  }

  return false;
}

void* initPacket(size_t len) {
  void* ptr = malloc(len);
  memset(ptr, 0, len);

  return ptr;
}

void sendPacket(const uint8_t ty, void* data, size_t len) {
  uint8_t *sendData = (uint8_t *)malloc(len + 1);

  memcpy(sendData + 1, data, sizeof(InitActorFrame));
  sendData[0] = ID_INIT_ACTOR_FRAME;

  webSocket.sendBIN(sendData, sizeof(InitActorFrame) + 1);

  free(sendData);
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if(type == WStype_CONNECTED) {
    setLed(COLOR_GREEN);
    return;
  }

  if(type == WStype_DISCONNECTED) {
    setLed(COLOR_PINK);
    return;
  }

  if(type != WStype_BIN) {
    // it it's not binary we don't care
    return;
  }

  // first byte is used as a packet type identifier
  auto packet_id = payload[0];

  switch(packet_id) {
    case ID_INIT_BEGIN_FRAME: // server wants to begin conn. let's identify ourselves
      {
        auto frame = INIT_PACKET(InitActorFrame);

        frame->id = 0x01;
        frame->type = 0x01;
        frame->pos_x = 11;
        frame->pos_y = 22;

        sendPacket(ID_INIT_ACTOR_FRAME, frame, sizeof(InitActorFrame));

        free(frame); 
      }
      break;

    default:
      {
        Serial.print("Unhandled packet id ");
        Serial.println(packet_id, HEX);
      }
      break;

  }
}

void setup() {
  Serial.begin(9600);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, 1);

  setLed(COLOR_RED);

  WiFi.begin(WIFI_SSID, WIFI_PSWD);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  setLed(COLOR_PINK);

  webSocket.begin(SERVER_HOST, SERVER_PORT, "/");
  webSocket.onEvent(webSocketEvent);
	webSocket.setReconnectInterval(5000);
}

bool privacyMode = false;
long lastBlink = millis();
uint8_t lastBrightness;

void loop() {
  webSocket.loop();

  if(button()) {
    privacyMode = !privacyMode;
    lastBlink = millis();
  }

  if(privacyMode) {
    if(millis() - lastBlink > 200) {
      lastBrightness = FastLED.getBrightness();
      if(lastBrightness == 0) {
        FastLED.setBrightness(255);
      } else {
        FastLED.setBrightness(0);
      }
      FastLED.show();
      lastBlink = millis();
    }
  } else {
    if(FastLED.getBrightness() == 0) {
      FastLED.setBrightness(255);
      FastLED.show();
    }
  }
}