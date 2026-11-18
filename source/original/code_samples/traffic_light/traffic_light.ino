// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const byte RED=8,YELLOW=9,GREEN=10;
const unsigned long RED_MS=2000,GREEN_MS=2000,YELLOW_MS=1000;
void show(byte pin,unsigned long duration){
  digitalWrite(RED,LOW);digitalWrite(YELLOW,LOW);digitalWrite(GREEN,LOW);
  digitalWrite(pin,HIGH);delay(duration);
}
void setup(){pinMode(RED,OUTPUT);pinMode(YELLOW,OUTPUT);pinMode(GREEN,OUTPUT);}
void loop(){show(RED,RED_MS);show(GREEN,GREEN_MS);show(YELLOW,YELLOW_MS);}
