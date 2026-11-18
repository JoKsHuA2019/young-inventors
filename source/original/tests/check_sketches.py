from pathlib import Path
import tempfile,subprocess
R=Path(__file__).resolve().parents[1]
stub=r'''
#include <cassert>
#include <string>
#include <vector>
#include <map>
using byte=unsigned char;
const int HIGH=1,LOW=0,OUTPUT=1,INPUT=0,INPUT_PULLUP=2,A0=14,A1=15,LED_BUILTIN=13;
unsigned long mockNow=0,mockPulse=1166;
int mockDigital=HIGH,mockAnalog=0,toneCalls=0;
std::map<int,int> outputs,modes;std::vector<int> writes,pwm;
struct MockSerial {int baud=0;std::vector<std::string>lines;void begin(int b){baud=b;}template<class T>void println(T v){lines.push_back(std::to_string(v));}void println(const char*s){lines.push_back(s);}void print(const char*s){lines.push_back(s);}} Serial;
void pinMode(int p,int m){modes[p]=m;}void digitalWrite(int p,int v){outputs[p]=v;writes.push_back(v);}int digitalRead(int){return mockDigital;}int analogRead(int){return mockAnalog;}void analogWrite(int p,int v){outputs[p]=v;pwm.push_back(v);}void delay(unsigned long x){mockNow+=x;}void delayMicroseconds(unsigned int){}unsigned long millis(){return mockNow;}unsigned long pulseIn(int,int,unsigned long timeout){assert(timeout==25000);return mockPulse;}void randomSeed(unsigned long){}long random(long a,long b){assert(a==2000&&b==5001);return 3000;}void tone(int,unsigned int,unsigned long=0){toneCalls++;}void noTone(int){}long map(long x,long a,long b,long c,long d){return (x-a)*(d-c)/(b-a)+c;}
'''
servo='''class Servo { public:int pos=-1,pin=-1;void attach(int p){pin=p;}void write(int a){assert(a>=60&&a<=100);pos=a;} };'''
tests={
'blink':'setup();loop();assert(modes[13]==OUTPUT && mockNow==1000 && outputs[13]==LOW);',
'button_magic':'setup();mockDigital=HIGH;loop();assert(outputs[9]==LOW);mockDigital=LOW;loop();assert(outputs[9]==HIGH && modes[2]==INPUT_PULLUP);',
'robot_eye':'setup();mockAnalog=512;loop();assert(Serial.lines.back()=="512" && Serial.baud==9600);',
'glow':'setup();loop();assert((pwm==std::vector<int>{0,64,128,192,255}));',
'secret_signal':'setup();loop();assert(toneCalls==0 && outputs[13]==LOW);',
'traffic_light':'setup();loop();assert(outputs[8]==LOW && outputs[9]==HIGH && outputs[10]==LOW && mockNow==5000);',
'night_light':'setup();mockAnalog=100;loop();assert(outputs[9]==HIGH);mockAnalog=900;loop();assert(outputs[9]==LOW);',
'box_guardian':'setup();mockAnalog=100;loop();assert(outputs[9]==LOW);mockAnalog=900;loop();assert(outputs[9]==HIGH);',
'distance':'setup();mockPulse=0;assert(readDistance()<0);mockPulse=100;assert(readDistance()<0);mockPulse=1166;assert(readDistance()>19&&readDistance()<21);mockPulse=6000;assert(readDistance()<0);',
'parking':'setup();mockNow=100;mockPulse=0;loop();assert(!valid&&outputs[9]==LOW);mockNow=200;mockPulse=875;loop();assert(valid&&period==150);mockNow=300;mockPulse=2041;loop();assert(period==400);mockNow=400;mockPulse=4082;loop();assert(period==800);',
'servo_wave':'setup();loop();assert(arm.pin==9&&arm.pos==100);',
'control_dial':'setup();mockAnalog=0;loop();assert(arm.pos==60);mockAnalog=1023;loop();assert(arm.pos==100);',
'drawbridge':'setup();mockDigital=HIGH;loop();assert(arm.pos==60);mockDigital=LOW;loop();assert(arm.pos==100);',
'creature':'setup();loop();assert(arm.pin==9&&arm.pos==60);',
'alternative':'',
' thermistor_trend':'setup();mockAnalog=600;loop();assert(Serial.lines.back()=="600");',
'reaction':'''setup();mockNow=20;loop();assert(state==WAIT);mockNow=50;mockDigital=LOW;loop();assert(state==RELEASE);mockNow=400;loop();assert(state==RELEASE);mockNow=500;mockDigital=HIGH;loop();mockNow=520;loop();assert(state==WAIT);mockNow=3520;loop();assert(state==CUE&&outputs[9]==HIGH);mockNow=3530;mockDigital=LOW;loop();mockNow=3550;loop();assert(state==RELEASE&&outputs[9]==LOW);bool found=false;for(auto&s:Serial.lines)if(s=="30")found=true;assert(found);mockNow=4000;loop();assert(state==RELEASE);'''
}
tests['thermistor_trend']=tests.pop(' thermistor_trend');tests.pop('alternative')
with tempfile.TemporaryDirectory() as td:
 p=Path(td);(p/'Servo.h').write_text(servo)
 for file in sorted((R/'code_samples').rglob('*.ino')):
  src=p/'check.cpp';src.write_text(stub+'\n'+file.read_text()+'\nint main(){'+tests[file.stem]+'}\n')
  subprocess.run(['g++','-std=c++17','-Wall','-Wextra','-Werror','-I',td,str(src),'-o',str(p/'check')],check=True,capture_output=True)
  subprocess.run([str(p/'check')],check=True)
  print('PASS host mock:',file.name)
print('Not Arduino-core compilation, device upload or physical safety verification.')
