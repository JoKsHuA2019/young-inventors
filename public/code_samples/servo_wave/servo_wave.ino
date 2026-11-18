// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Servo uses adult-prepared external regulated 5 V and common GND.
// Keep external positive separate from Uno 5 V. Isolate BOTH sources before changes.
#include <Servo.h>
Servo arm;
const byte SIGNAL=9;
const int LOW_TARGET=60,HIGH_TARGET=100; // Adult bench-verifies actual safe range.
void servoStart(){arm.attach(SIGNAL);arm.write(LOW_TARGET);}
void setup(){servoStart();}
void loop(){arm.write(LOW_TARGET);delay(1500);arm.write(HIGH_TARGET);delay(1500);}
