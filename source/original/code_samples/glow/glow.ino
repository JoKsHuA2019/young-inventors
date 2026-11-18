// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const byte LED=9;
const int VALUES[]={0,64,128,192,255};
void setup(){pinMode(LED,OUTPUT);Serial.begin(9600);}
void loop(){
  for(byte i=0;i<5;i++){
    analogWrite(LED,VALUES[i]);Serial.println(VALUES[i]);delay(2000);
  }
}
