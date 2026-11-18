// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
void setup(){Serial.begin(9600);}
void loop(){Serial.println(analogRead(A0));delay(500);}
