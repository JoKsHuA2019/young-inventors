// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const byte TRIG=6,ECHO=7;
const unsigned long ECHO_TIMEOUT_US=25000;
float readDistance(){
  digitalWrite(TRIG,LOW);delayMicroseconds(2);
  digitalWrite(TRIG,HIGH);delayMicroseconds(10);digitalWrite(TRIG,LOW);
  const unsigned long echo=pulseIn(ECHO,HIGH,ECHO_TIMEOUT_US);
  if(echo==0) return -1.0f;
  const float cm=echo*0.0343f/2.0f;
  if(cm<5.0f || cm>100.0f) return -1.0f;
  return cm;
}
void sensorStart(){pinMode(TRIG,OUTPUT);digitalWrite(TRIG,LOW);pinMode(ECHO,INPUT);Serial.begin(9600);}
void setup(){sensorStart();}
void loop(){
  const float cm=readDistance();
  if(cm<0) Serial.println("MISSING or OUT OF RANGE");
  else Serial.println(cm);
  delay(100); // More than 60 ms between bursts.
}
