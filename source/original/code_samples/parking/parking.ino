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
const byte LED=9;
unsigned long sampledAt=0,flashedAt=0,period=800;
bool valid=false,lightOn=false;
void setup(){sensorStart();pinMode(LED,OUTPUT);digitalWrite(LED,LOW);}
void loop(){
  unsigned long now=millis();
  if((unsigned long)(now-sampledAt)>=100){
    sampledAt=now;const float cm=readDistance();valid=(cm>=0);
    if(!valid){Serial.println("INVALID: distance unknown");lightOn=false;digitalWrite(LED,LOW);}
    else{period=cm<25 ? 150 : (cm<50 ? 400 : 800);Serial.println(cm);}
  }
  now=millis();
  if(valid && (unsigned long)(now-flashedAt)>=period){
    flashedAt=now;lightOn=!lightOn;digitalWrite(LED,lightOn ? HIGH : LOW);
  }
}
