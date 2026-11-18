// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const unsigned long ON_MS=500, OFF_MS=500;
void setup(){pinMode(LED_BUILTIN,OUTPUT);}
void loop(){
  digitalWrite(LED_BUILTIN,HIGH); delay(ON_MS);
  digitalWrite(LED_BUILTIN,LOW); delay(OFF_MS);
}
