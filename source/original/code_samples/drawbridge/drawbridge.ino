// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Servo uses adult-prepared external regulated 5 V and common GND.
// Keep external positive separate from Uno 5 V. Isolate BOTH sources before changes.
#include <Servo.h>
Servo arm;
const byte SIGNAL=9;
const int LOW_TARGET=60,HIGH_TARGET=100; // Adult bench-verifies actual safe range.
void servoStart(){arm.attach(SIGNAL);arm.write(LOW_TARGET);}
const byte BUTTON=2;
void setup(){pinMode(BUTTON,INPUT_PULLUP);servoStart();}
void loop(){arm.write(digitalRead(BUTTON)==LOW ? HIGH_TARGET : LOW_TARGET);delay(20);}
