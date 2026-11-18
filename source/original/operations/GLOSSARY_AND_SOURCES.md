# Glossary and technical references
- Circuit: a conducting route through parts and back to the source; this build needs a complete loop.
- Current: flow of electric charge; an LED branch needs current limiting.
- Resistor: component that resists current flow; not a one-way device.
- Anode / cathode: the LED terminals marked A / K here; verify actual polarity, especially after trimming.
- Series: components along the same branch, carrying the same current.
- Parallel: separate branches across the source; each LED branch gets its own resistor.
- Ground / GND: the circuit reference/return connection in these builds, not a connection to soil.
- Input / output: a signal the board reads / a signal it sets.
- INPUT_PULLUP: input setting that uses an internal pull-up; a switch to ground reads LOW when pressed.
- PWM: repeated HIGH/LOW pulses; changing their on-time changes apparent LED brightness, not a smooth adjustable DC output.
- Voltage divider: components in series whose junction provides part of the source voltage.
- ADC: conversion from measured analog voltage to a numerical reading; the selected Uno R3 normally uses 0–1023.
- Lever / pivot: a turning arm / the point around which it turns.
- Hypothesis: a possible explanation you can test.
- Evidence: what you actually observed, distinguished from what you guessed.
- Calibration: choosing settings by testing the actual environment/parts.

## Primary technical sources consulted November 10, 2026
Arduino InputPullupSerial source: https://github.com/arduino/docs-content/blob/main/content/built-in-examples/02.digital/InputPullupSerial/InputPullupSerial.md
Supports released HIGH / grounded press LOW. Our sketch separately maps LOW input to HIGH output.
Arduino Analog Input: https://docs.arduino.cc/built-in-examples/analog/AnalogInput/
Supports photoresistor voltage-divider measurement and nominal Uno 0–1023 conversion. Our upper-LDR divider orientation and qualitative test plan are explicitly specified in S01.
Arduino INPUT / INPUT_PULLUP / OUTPUT: https://docs.arduino.cc/language-reference/en/variables/constants/inputOutputPullup/
Arduino digitalWrite: https://docs.arduino.cc/language-reference/en/functions/digital-io/digitalwrite/

References support principles, not certification of our wiring, chosen parts or new sketches. No physical test is inferred from documentation. Competitive or legal statements from the blueprint are outside this curriculum review; they have not been independently revalidated here.
