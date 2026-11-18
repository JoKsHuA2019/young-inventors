// Draft for Arduino Uno R3 (5 V logic). NOT board-compiled or bench-tested.
// USB OFF: 5 V -> LDR -> junction J -> 10 kohm -> GND; A0 -> J.
// Values are relative ADC readings, NOT calibrated lux.
const byte LIGHT_PIN = A0;
void setup() {
  Serial.begin(9600); // Set Serial Monitor to the same rate.
}
void loop() {
  const int reading = analogRead(LIGHT_PIN); // Nominal 0..1023 on Uno R3.
  Serial.println(reading); // Usually larger with brighter light for this divider.
  delay(250); // Four observations per second; let lighting settle before logging.
}
