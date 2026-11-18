// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const byte LIGHT=A0,LED=9;
const int THRESHOLD=500; // Replace after measured open/closed calibration.
void setup(){pinMode(LED,OUTPUT);Serial.begin(9600);}
void loop(){
  const int reading=analogRead(LIGHT);
  digitalWrite(LED,reading>THRESHOLD ? HIGH : LOW); // High-on box alert.
  Serial.println(reading);delay(100);
}
