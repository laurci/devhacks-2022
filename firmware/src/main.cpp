#include <Arduino.h>

#include <WiFi.h>
#include <WebSocketsClient.h>

#include "secrets.h"

#include "proto.h"

#define USE_SERIAL Serial

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if(type == WStype_BIN) {
      if(payload[0] == ID_INIT_BEGIN_FRAME) {
        uint8_t *sendData = (uint8_t *)malloc(sizeof(InitActorFrame) + 1);
        InitActorFrame *frame = (InitActorFrame*)malloc(sizeof(InitActorFrame));

        memset(frame, 0, sizeof(InitActorFrame));

        frame->id = 0x01;
        frame->type = 0x01;
        frame->pos_x = 11;
        frame->pos_y = 22;

        memcpy(sendData + 1, frame, sizeof(InitActorFrame));
        sendData[0] = ID_INIT_ACTOR_FRAME;

        for(int i = 0; i < sizeof(InitActorFrame) + 1; i++) {
          Serial.print(sendData[i], HEX);
          Serial.print(" ");
        }
        Serial.println();

        webSocket.sendBIN(sendData, sizeof(InitActorFrame) + 1);

        free(sendData);
        free(frame);
      }
  }
}

void setup() {
  Serial.begin(9600);

  WiFi.begin(WIFI_SSID, WIFI_PSWD);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  webSocket.begin(SERVER_HOST, SERVER_PORT, "/");
  webSocket.onEvent(webSocketEvent);
	webSocket.setReconnectInterval(5000);

  // client.onMessage([](WebsocketsMessage msg){
  //   auto raw = msg.rawData();
  //   uint8_t packet_id = raw[0];
  //   if(packet_id == 0x01) {
  //     Serial.println("sending");


  //   }

  //   Serial.print("Got Message ");
  //   Serial.print(raw[0], HEX);
  //   Serial.println();
  // });
}

void loop() {
  webSocket.loop();
}