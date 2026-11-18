// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Servo uses adult-prepared external regulated 5 V and common GND.
// Keep external positive separate from Uno 5 V. Isolate BOTH sources before changes.
#include <Servo.h>
Servo arm;
const byte SIGNAL=9;
const int LOW_TARGET=60,HIGH_TARGET=100; // Adult bench-verifies actual safe range.
void servoStart(){arm.attach(SIGNAL);arm.write(LOW_TARGET);}
void setup(){servoStart();Serial.begin(9600);}
void loop(){
  const int reading=analogRead(A0);
  const int target=(int)map(reading,0,1023,LOW_TARGET,HIGH_TARGET);
  arm.write(target);Serial.println(reading);delay(20);
}
