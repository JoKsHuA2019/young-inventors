// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const bool SOUND_ENABLED=false; // Adult verifies quiet passive piezo before true.
const byte PIEZO=8;
void signalEvent(unsigned long duration){
  digitalWrite(LED_BUILTIN,HIGH);
  if(SOUND_ENABLED) tone(PIEZO,440);
  delay(duration);
  if(SOUND_ENABLED) noTone(PIEZO);
  digitalWrite(LED_BUILTIN,LOW);delay(300);
}
void setup(){pinMode(LED_BUILTIN,OUTPUT);}
void loop(){
  signalEvent(200);signalEvent(600);delay(1000);
  if(SOUND_ENABLED){
    tone(PIEZO,440,200);delay(500);
    tone(PIEZO,880,200);delay(1000);
  }
}
