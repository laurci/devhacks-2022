#include <FastLED.h>

#define LED_PIN     16
#define NUM_LEDS    1

CRGB leds[NUM_LEDS];

void setup() {

  pinMode(17, INPUT_PULLUP);

  FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, NUM_LEDS);

}

void loop() {

  int r,g,b;

  for (int i = 0; i <= 255; i++) {
    leds[0] = CRGB ( r, g, b);
    FastLED.show();
    delay(5);
  }
  for (int i = 255; i >= 0; i--) {
    leds[0] = CRGB ( r, g, b);
    FastLED.show();
    delay(5);
  }
}