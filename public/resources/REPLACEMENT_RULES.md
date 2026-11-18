# Material replacement rules
No substitutions are automatic. An adult checks the actual part and revises the BOM, diagrams and review record. Parts-on-hand matching must use verified part IDs, quantities and board variants, never keyword similarity alone. Costs remain blank until a dated, region-specific, quantity-specific vendor basket is obtained.

| Item | Allowed candidate | Must verify / forbidden default |
|---|---|---|
| 3 V source | Holder for two matched alkaline AA cells | Correct polarity, insulated leads; no coin cells, lithium cells, USB battery pack or higher voltage substitution |
| Ordinary red LED | Known ordinary red indicator LED | Datasheet/current and polarity; higher-forward-voltage colors can fail on 3 V; no resistor-free branch |
| 220 Ω LED resistor | Same resistance, adequate rated ordinary resistor | Measure/identify value; one per powered LED branch; no resistor bypass |
| Breadboard/jumpers | Compatible solderless board and insulated leads | Actual strip grouping, split rails, secure lead fit; do not silently reuse hole coordinates |
| Uno R3 | Exact reviewed 5 V Uno R3-compatible board | Confirm model, USB connector and pinout; Uno R4/3.3 V boards need separate variants |
| Button | Normally-open momentary switch | Identify switched contacts; four-pin body alone does not define correct pair |
| LDR | Reviewed two-lead photoresistor | Not a sensor module; useful resistance range and divider trend on selected 10 kΩ resistor |
| Fixed sensor resistor | 10 kΩ resistor | Not a 220 Ω LED resistor; changing value changes range and requires calibration/review |
| Cardboard/paper pivot | Precut stable cardboard, covered blunt fastener | Clearance and flex; no sharp punches, blades, heavy loads or exposed prongs in learner activity |
| Servo, later lessons | Exact 5 V-rated low-force model | Adult-prepared regulated 5 V external supply, current budget, common GND, safe range/load; never GPIO power; no loose battery hacks |
| HC-SR04, later lessons | Exact reviewed module | ECHO 5 V only for this Uno R3 variant; 3.3 V MCU needs separately tested shifting; missing echo must be rejected |
| Piezo, later lessons | Specified low-current passive piezo | Check current and volume; no high-current siren; LED-only route always offered |
| Thermistor, later lesson | Exact 10 kΩ NTC | Relative trend only; adult checks insulated bead, dry gentle contact; no hot water/flame/heater |

Reuse within a session only when unpowered; count returned parts. More LEDs require more current-limiting branches, not direct parallel LEDs on a single shared resistor. Spare parts are facilitator stock and do not silently increase per-learner BOM quantities.
