export type Pilot = {
  title: string;
  prep: string[];
  ask: string;
  concept: string;
  pause: string;
  build: { title: string; role: string; text: string }[];
  observations: string[];
  remixes: { title: string; text: string }[];
};
export const pilots: Record<string, Pilot> = {
  c01: {
    title: "Where did Mouse’s light path go?",
    prep: [
      "A helper prepares and checks the circuit first. Gather the exact two-AA holder, matched alkaline cells, red LED, 220 Ω ¼ W resistor, breadboard, and four insulated wires.",
      "Check the breadboard rows and mark the LED’s direction. Prepare a known-good loop. Keep power disconnected for every wiring change, and inspect before reconnecting.",
    ],
    ask: "Can you show Mouse where the path stops? What stayed the same between our tries?",
    concept:
      "Follow a complete path through the resistor and light, then investigate just the return connection.",
    pause:
      "Let Mouse’s lamp rest. Your helper disconnects the battery, checks the pieces, and helps put the small parts away. Save a little note about where you stopped.",
    build: [
      {
        title: "Find two little rows",
        role: "Helper’s turn",
        text: "Keep the battery disconnected. Your helper marks two separate connected rows for the light’s legs.",
      },
      {
        title: "Give the light a place",
        role: "Your turn, with your helper",
        text: "Put the LED’s checked legs into the two marked rows. Your helper helps label A (+) and K (−), so we can remember which is which.",
      },
      {
        title: "Add the resistor",
        role: "Helper’s turn",
        text: "Join one end of the 220 Ω resistor to the A row. Its other end goes in a new, unused row. This little piece stays in our circuit.",
      },
      {
        title: "Start the path",
        role: "Helper’s turn",
        text: "With the battery still disconnected, join the holder’s positive lead to the resistor’s free row. The resistor comes before the LED.",
      },
      {
        title: "Make a way back",
        role: "Your turn, with your helper",
        text: "Join the K row to the disconnected holder’s negative lead. Now trace the whole route with your helper.",
      },
      {
        title: "Check together",
        role: "Helper’s turn",
        text: "Your helper checks the path: positive, resistor, A, K, negative. They also check for unwanted joins and loose bare ends.",
      },
      {
        title: "A little light for Mouse",
        role: "Helper’s turn, then your observation",
        text: "Your helper connects the checked 3 V holder. Watch without moving wires. If anything warms, smells unusual, or looks damaged, your helper disconnects it straight away.",
      },
    ],
    observations: [
      "The light shone.",
      "The light stayed dark.",
      "The light flickered.",
    ],
    remixes: [
      {
        title: "A cozy home for the light",
        text: "Draw or fold a little tent, cave, or reading nook for Mouse’s lamp. Leave the batteries easy for your helper to reach, and keep the circuit unchanged.",
      },
      {
        title: "A different-looking path",
        text: "Draw a new route for the wires that keeps every electrical connection the same. Ask your helper to disconnect power before changing the real layout.",
      },
    ],
  },
  m01: {
    title: "Help Fox compare two little pushes",
    prep: [
      "A helper cuts, punches, and checks the moving parts first. Prepare the 24 × 3 cm cardboard arm, 30 × 15 cm base, support tabs, and covered blunt fastener.",
      "Keep the arm free above the base. Use only the light paper load. Mark a small target height both push spots can reach, and check the clearance.",
    ],
    ask: "What did your hand do differently when the jaw reached the same mark?",
    concept:
      "A farther push can feel easier, while the hand travels farther for the same lift. Not feeling a difference is a useful observation, too.",
    pause:
      "Let Fox’s jaw stop moving. Your helper checks the covered fastener and helps store the paper load and loose pieces. Save which push spot you want to try next.",
    build: [
      {
        title: "A steady place for Fox",
        role: "Your turn, with your helper",
        text: "Tape the prepared 30 × 15 cm base flat on the table. Give the tape a gentle pat so the base stays still.",
      },
      {
        title: "Mark our little landmarks",
        role: "Your turn, with your helper",
        text: "Measure from the load end of the 24 cm strip. Mark the load at 2 cm, pivot at 8 cm, near push at 14 cm, and far push at 22 cm.",
      },
      {
        title: "Fit the turning point",
        role: "Helper’s turn",
        text: "Your helper fits the blunt fastener through the prepared 8 cm hole and support tabs, then covers its back. The arm needs room to turn.",
      },
      {
        title: "Add the paper passenger",
        role: "Your turn, with your helper",
        text: "Tape the same little paper load at the 2 cm mark. Keep it clear of the pivot and table.",
      },
      {
        title: "Choose a little lift",
        role: "Your turn, with your helper",
        text: "Place a paper height marker beside the load. Your helper checks that both push spots can reach this small height.",
      },
      {
        title: "Try the near spot",
        role: "Your turn",
        text: "Keep your fingers away from the pivot. Push gently at the 14 cm mark until the load reaches the target. What did your hand feel?",
      },
      {
        title: "Try the far spot",
        role: "Your turn",
        text: "Start in the same place. Push at the 22 cm mark to lift the load to the same target. Then try far first and near second. Stop if the cardboard bends or catches.",
      },
    ],
    observations: [
      "The far push felt easier.",
      "The two pushes felt about the same.",
      "The far push felt harder.",
    ],
    remixes: [
      {
        title: "A creature of your own",
        text: "Will your cardboard jaw belong to a fox, frog, or a creature nobody has met? Add light paper decorations while keeping the pivot and movement clear.",
      },
      {
        title: "A spot in between",
        text: "Ask your helper to mark a third push spot 10 cm from the pivot. Predict how it will feel, then compare it with the same load and lift height.",
      },
    ],
  },
  i01: {
    title: "A tiny mystery with a hidden inside",
    prep: [
      "A helper builds and checks the closed mystery model first. Use a contained, low-force cardboard lever and return mechanism, with marked limits for the outside tab.",
      "Keep fingers clear of gaps. Leave the inside closed for the first tests. The helper controls any reveal after the observations. Use the prepared model, not an appliance or an unknown object.",
    ],
    ask: "What did you see, and which part are you imagining? Could a different inside do that too?",
    concept:
      "An observation is something we saw. An explanation is an idea we can investigate. More than one inside can sometimes fit the same clue.",
    pause:
      "Let the tab come to rest and leave the box closed. Your helper stores the model. Tuck your ideas into the notebook so the mystery is waiting when you return.",
    build: [
      {
        title: "Meet Fox’s mystery",
        role: "Helper’s turn",
        text: "Your helper brings a checked, closed cardboard box with a little push tab. Find its marked movement limit together.",
      },
      {
        title: "Look closely",
        role: "Your turn",
        text: "Draw the moving parts you can see from outside. Keep the lid closed. What tiny details might matter?",
      },
      {
        title: "Imagine two insides",
        role: "Your turn",
        text: "One idea says the tab will come back after a push. Another says it will stay where you leave it. Draw or describe what each idea predicts.",
      },
      {
        title: "Choose a gentle test",
        role: "Your turn, with your helper",
        text: "Plan one gentle push and release within the marked range. Which prediction could this help you check?",
      },
      {
        title: "Watch the first try",
        role: "Your turn",
        text: "Try the action your helper approved. Keep fingers away from gaps. Watch what the tab actually does.",
      },
      {
        title: "Try the same thing again",
        role: "Your turn",
        text: "Repeat the same gentle push. Did you see the same result, or something different?",
      },
      {
        title: "Compare our ideas",
        role: "Helper’s turn, together",
        text: "Tell your helper what you saw. If they allow it, let them open the prepared model. Compare its inside with your ideas—our first guess wasn’t proof.",
      },
    ],
    observations: [
      "The tab came back.",
      "The tab stayed where I left it.",
      "The tab didn’t move.",
    ],
    remixes: [
      {
        title: "Another possible inside",
        text: "Draw a different mechanism that might make a tab come back. What would you expect to see from outside?",
      },
      {
        title: "A new disguise for the box",
        text: "Sketch a sleepy creature, tiny house, or secret workshop around the same mystery. Keep the tab and its movement marks clear; ask your helper before adding anything to the real box.",
      },
    ],
  },
};
