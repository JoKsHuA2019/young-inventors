// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const byte LIGHT=A0,LED=9;
const int THRESHOLD=500; // Replace with a threshold supported by your local groups.
void setup(){pinMode(LED,OUTPUT);Serial.begin(9600);}
void loop(){
  const int reading=analogRead(LIGHT);
  digitalWrite(LED,reading<THRESHOLD ? HIGH : LOW);
  Serial.println(reading);delay(100);
}
