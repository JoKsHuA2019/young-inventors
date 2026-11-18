// Curriculum manuscript. Target: Arduino Uno R3, 5 V logic only.
// NOT Arduino-core-compiled, uploaded or physically bench-tested.
// Disconnect USB before wiring. Follow the matching lesson connection table.
const byte BUTTON=2,LED=9;
const unsigned long DEBOUNCE_MS=20;
enum State {RELEASE,WAIT,CUE};
State state=RELEASE;
int rawPrevious=HIGH,stable=HIGH;
unsigned long changedAt=0,waitStarted=0,waitMs=0,cueStarted=0;
void setup(){
  pinMode(BUTTON,INPUT_PULLUP);pinMode(LED,OUTPUT);
  digitalWrite(LED,LOW);Serial.begin(9600);
  randomSeed(analogRead(A1)); // Unused pin noise is not secure randomness.
  Serial.println("Release the button to arm.");
}
void loop(){
  const unsigned long now=millis();
  const int raw=digitalRead(BUTTON);
  if(raw!=rawPrevious){rawPrevious=raw;changedAt=now;}
  bool pressedEdge=false;
  if(raw!=stable && (unsigned long)(now-changedAt)>=DEBOUNCE_MS){
    stable=raw;pressedEdge=(stable==LOW);
  }
  if(state==RELEASE){
    if(raw==HIGH && stable==HIGH && (unsigned long)(now-changedAt)>=DEBOUNCE_MS){
      waitMs=(unsigned long)random(2000,5001);
      waitStarted=now;state=WAIT;Serial.println("Wait for the light.");
    }
  }else if(state==WAIT){
    // Catch raw early contact too. Require release before another trial.
    if(raw==LOW){state=RELEASE;Serial.println("False start. Release to retry.");}
    else if((unsigned long)(now-waitStarted)>=waitMs){
      digitalWrite(LED,HIGH);cueStarted=now;state=CUE;
    }
  }else if(state==CUE && pressedEdge){
    Serial.print("Reaction ms (includes debounce): ");
    Serial.println((unsigned long)(now-cueStarted));
    digitalWrite(LED,LOW);state=RELEASE;
    Serial.println("Release to retry.");
  }
}
