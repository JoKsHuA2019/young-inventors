// Draft for Arduino Uno R3 (5 V logic). NOT board-compiled or bench-tested.
// Unplug USB before wiring: D2 -> normally-open button -> GND.
// D9 -> 220 ohm -> red LED anode; LED cathode -> GND.
const byte BUTTON_PIN = 2;
const byte LED_PIN = 9;
void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // Released HIGH, grounded press LOW.
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  Serial.begin(9600);
}
void loop() {
  const int input = digitalRead(BUTTON_PIN);
  const bool pressed = (input == LOW);
  digitalWrite(LED_PIN, pressed ? HIGH : LOW); // Separate output rule.
  Serial.println(pressed ? "LOW: pressed; LED on" : "HIGH: released; LED off");
  delay(100); // Limits print rate; not a press counter or debounce algorithm.
}
