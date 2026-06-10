const levels = [
  {
    title: "Level 1 — Modus Ponens",
    subtitle: "Select compatible symbolic blocks.",
    target: "Q",
    premises: ["P → Q", "P"],
    hints: [
      "Look for the implication.",
      "Use P → Q together with P.",
    ],
    steps: [
      {
        inputs: ["P → Q", "P"],
        output: "Q",
        label: "Modus Ponens",
        explanation: "From P → Q and P, Q follows.",
      },
    ],
  },
  {
    title: "Level 2 — Modus Tollens",
    subtitle: "A denial can move backward through an implication.",
    target: "¬P",
    premises: ["P → Q", "¬Q"],
    hints: [
      "Start from the denied conclusion.",
      "Combine P → Q with ¬Q.",
    ],
    steps: [
      {
        inputs: ["P → Q", "¬Q"],
        output: "¬P",
        label: "Modus Tollens",
        explanation: "If Q is false, P cannot have led to Q.",
      },
    ],
  },
  {
    title: "Level 3 — Hypothetical Syllogism",
    subtitle: "Two implications can form a longer chain.",
    target: "P → R",
    premises: ["P → Q", "Q → R"],
    hints: [
      "Both blocks are implications.",
      "Link the middle symbol Q.",
    ],
    steps: [
      {
        inputs: ["P → Q", "Q → R"],
        output: "P → R",
        label: "Hypothetical Syllogism",
        explanation: "If P leads to Q and Q leads to R, then P leads to R.",
      },
    ],
  },
  {
    title: "Level 4 — Chain Proof",
    subtitle: "Combine derived statements to complete the proof.",
    target: "R",
    premises: ["P → Q", "¬Q", "¬P → R"],
    hints: [
      "The first move does not reach R yet.",
      "Use P → Q with ¬Q before touching ¬P → R.",
      "A derived ¬P will open the last implication.",
    ],
    steps: [
      {
        inputs: ["P → Q", "¬Q"],
        output: "¬P",
        label: "Modus Tollens",
        explanation: "From P → Q and ¬Q, infer ¬P.",
      },
      {
        inputs: ["¬P", "¬P → R"],
        output: "R",
        label: "Modus Ponens",
        explanation: "Once ¬P is known, R follows from ¬P → R.",
      },
    ],
  },
  {
    title: "Level 5 — Conjunction Introduction",
    subtitle: "Two statements can be joined into one.",
    target: "P ∧ Q",
    premises: ["P", "Q"],
    hints: [
      "Nothing needs to be derived first.",
      "Try joining the two available statements.",
    ],
    steps: [
      {
        inputs: ["P", "Q"],
        output: "P ∧ Q",
        label: "Conjunction Introduction",
        explanation: "When P and Q are both available, they can be combined.",
      },
    ],
  },
  {
    title: "Level 6 — Simplification Chain",
    subtitle: "Extract one statement, then use it.",
    target: "S",
    premises: ["P ∧ Q", "P → S", "Q → R"],
    hints: [
      "One block contains two parts.",
      "First isolate the symbol that matches an implication.",
      "Q → R is not needed for the target.",
    ],
    steps: [
      {
        inputs: ["P ∧ Q"],
        output: "P",
        label: "Simplification",
        explanation: "A conjunction allows one of its parts to be taken out.",
      },
      {
        inputs: ["P → S", "P"],
        output: "S",
        label: "Modus Ponens",
        explanation: "With P and P → S, S follows.",
      },
    ],
  },
  {
    title: "Level 7 — Disjunctive Syllogism",
    subtitle: "Eliminate one branch of the disjunction.",
    target: "Q",
    premises: ["P ∨ Q", "¬P"],
    hints: [
      "One option is ruled out.",
      "The remaining branch is the target.",
    ],
    steps: [
      {
        inputs: ["P ∨ Q", "¬P"],
        output: "Q",
        label: "Disjunctive Syllogism",
        explanation: "If P is excluded from P ∨ Q, only Q remains.",
      },
    ],
  },
  {
    title: "Level 8 — Double Negation Chain",
    subtitle: "Unwrap a statement, then carry it through two implications.",
    target: "R",
    premises: ["¬¬P", "P → Q", "Q → R"],
    hints: [
      "The first block hides a positive statement.",
      "After that, the path moves through Q.",
      "The proof ends only after two uses of Modus Ponens.",
    ],
    steps: [
      {
        inputs: ["¬¬P"],
        output: "P",
        label: "Double Negation",
        explanation: "A double negation returns the original statement.",
      },
      {
        inputs: ["P → Q", "P"],
        output: "Q",
        label: "Modus Ponens",
        explanation: "From P → Q and P, infer Q.",
      },
      {
        inputs: ["Q → R", "Q"],
        output: "R",
        label: "Modus Ponens",
        explanation: "From Q → R and Q, infer R.",
      },
    ],
  },
  {
    title: "Level 9 — Contraposition in Use",
    subtitle: "Transform the implication, then apply it.",
    target: "¬P",
    premises: ["P → Q", "¬Q"],
    hints: [
      "A transformation may help before the final step.",
      "Turn P → Q around by negating both sides.",
      "The new implication can work with ¬Q.",
    ],
    steps: [
      {
        inputs: ["P → Q"],
        output: "¬Q → ¬P",
        label: "Contraposition",
        explanation: "An implication can be rewritten as its contrapositive.",
      },
      {
        inputs: ["¬Q → ¬P", "¬Q"],
        output: "¬P",
        label: "Modus Ponens",
        explanation: "With ¬Q and ¬Q → ¬P, conclude ¬P.",
      },
    ],
  },
  {
    title: "Level 10 — Mixed Proof",
    subtitle: "Two clean steps are hidden among extra blocks.",
    target: "R",
    premises: ["P → Q", "Q → R", "P", "¬R → S", "Q ∧ T"],
    hints: [
      "Not every block belongs to the proof.",
      "Begin with the only direct premise for an implication.",
      "The conjunction is a decoy here.",
    ],
    steps: [
      {
        inputs: ["P → Q", "P"],
        output: "Q",
        label: "Modus Ponens",
        explanation: "P activates the implication P → Q.",
      },
      {
        inputs: ["Q → R", "Q"],
        output: "R",
        label: "Modus Ponens",
        explanation: "The derived Q activates Q → R.",
      },
    ],
  },
  {
    title: "Level 11 — False Consequence",
    subtitle: "A valid step is not always the useful one.",
    target: "R",
    premises: ["P → Q", "Q", "P → R", "P"],
    hints: [
      "One implication reaches the target directly.",
      "Another valid move leads somewhere true but unhelpful.",
      "Do not chase Q just because it is already present.",
    ],
    steps: [
      {
        inputs: ["P → Q", "P"],
        output: "Q",
        label: "Modus Ponens",
        explanation: "From P → Q and P, Q follows.",
      },
      {
        inputs: ["P → R", "P"],
        output: "R",
        label: "Modus Ponens",
        explanation: "From P → R and P, R follows.",
      },
    ],
  },
  {
    title: "Level 12 — Necessary Thread",
    subtitle: "Some correct steps still lead away from the goal.",
    target: "T",
    premises: ["P → Q", "P → R", "Q → T", "R → S", "P"],
    hints: [
      "Two branches open from P.",
      "Only one branch reaches T.",
      "R is a valid detour, but not the winning thread.",
    ],
    steps: [
      {
        inputs: ["P → Q", "P"],
        output: "Q",
        label: "Modus Ponens",
        explanation: "P activates the implication P → Q.",
      },
      {
        inputs: ["P → R", "P"],
        output: "R",
        label: "Modus Ponens",
        explanation: "P also activates the implication P → R.",
      },
      {
        inputs: ["R → S", "R"],
        output: "S",
        label: "Modus Ponens",
        explanation: "R can validly lead to S, even if S is not the target.",
      },
      {
        inputs: ["Q → T", "Q"],
        output: "T",
        label: "Modus Ponens",
        explanation: "Once Q is known, Q → T gives T.",
      },
    ],
  },
  {
    title: "Level 13 — Extended Thread",
    subtitle: "The useful line is longer now, though not the only valid one.",
    target: "U",
    premises: ["P → Q", "Q → R", "R → U", "P", "P → S"],
    hints: [
      "The target waits at the end of the longest direct chain.",
      "Start with the single premise that activates an implication.",
      "S can be reached, but it does not finish the proof.",
    ],
    steps: [
      {
        inputs: ["P → Q", "P"],
        output: "Q",
        label: "Modus Ponens",
        explanation: "P begins the longer chain by activating P → Q.",
      },
      {
        inputs: ["P → S", "P"],
        output: "S",
        label: "Modus Ponens",
        explanation: "P also leads to S, though S does not complete the level.",
      },
      {
        inputs: ["Q → R", "Q"],
        output: "R",
        label: "Modus Ponens",
        explanation: "With Q in hand, Q → R carries the proof forward.",
      },
      {
        inputs: ["R → U", "R"],
        output: "U",
        label: "Modus Ponens",
        explanation: "The final implication turns R into U.",
      },
    ],
  },
  {
    title: "Level 14 — Narrow Passage",
    subtitle: "A closed branch leaves only one path forward.",
    target: "T",
    premises: ["P ∨ Q", "¬P", "Q → R", "R → T", "Q → S"],
    hints: [
      "The disjunction must be narrowed before the chain can continue.",
      "Removing one branch reveals the symbol you need.",
      "S is reachable, but it is not the target.",
    ],
    steps: [
      {
        inputs: ["P ∨ Q", "¬P"],
        output: "Q",
        label: "Disjunctive Syllogism",
        explanation: "Once P is excluded from P ∨ Q, Q remains.",
      },
      {
        inputs: ["Q → S", "Q"],
        output: "S",
        label: "Modus Ponens",
        explanation: "Q can lead to S, but that branch stops short of the goal.",
      },
      {
        inputs: ["Q → R", "Q"],
        output: "R",
        label: "Modus Ponens",
        explanation: "The useful branch takes Q forward to R.",
      },
      {
        inputs: ["R → T", "R"],
        output: "T",
        label: "Modus Ponens",
        explanation: "From R, the last implication yields T.",
      },
    ],
  },
  {
    title: "Level 15 — Compressed Route",
    subtitle: "It can help to shorten the path before moving backward.",
    target: "¬P",
    premises: ["P → Q", "Q → R", "¬R", "P → S"],
    hints: [
      "The last block is not part of the winning route.",
      "First build a single implication that reaches R from P.",
      "Once that shorter route exists, the denial of R can travel back.",
    ],
    steps: [
      {
        inputs: ["P → S"],
        output: "¬S → ¬P",
        label: "Contraposition",
        explanation: "P → S can be rewritten, though that new form does not help here.",
      },
      {
        inputs: ["P → Q", "Q → R"],
        output: "P → R",
        label: "Hypothetical Syllogism",
        explanation: "Linking the two implications creates a shorter route from P to R.",
      },
      {
        inputs: ["P → R", "¬R"],
        output: "¬P",
        label: "Modus Tollens",
        explanation: "If R is denied, then P cannot stand behind P → R.",
      },
    ],
  },
  {
    title: "Level 16 — Joined Premise",
    subtitle: "Two simple statements can unlock a stronger condition.",
    target: "U",
    premises: ["P", "Q", "P ∧ Q → R", "R → U", "Q → S"],
    hints: [
      "The room needs a combined statement before it opens.",
      "Join the two plain premises first.",
      "S is available along the way, but it is not the conclusion.",
    ],
    steps: [
      {
        inputs: ["P", "Q"],
        output: "P ∧ Q",
        label: "Conjunction Introduction",
        explanation: "P and Q can be joined into the condition the next implication needs.",
      },
      {
        inputs: ["Q → S", "Q"],
        output: "S",
        label: "Modus Ponens",
        explanation: "Q leads to S, but that branch does not reach the target.",
      },
      {
        inputs: ["P ∧ Q → R", "P ∧ Q"],
        output: "R",
        label: "Modus Ponens",
        explanation: "Once P ∧ Q is available, it activates the implication to R.",
      },
      {
        inputs: ["R → U", "R"],
        output: "U",
        label: "Modus Ponens",
        explanation: "R opens the final step to U.",
      },
    ],
  },
  {
    title: "Level 17 — Split Attention",
    subtitle: "One joined block helps, and another quietly distracts.",
    target: "V",
    premises: ["P ∧ R", "Q ∧ S", "P → T", "T → V", "Q → U"],
    hints: [
      "Both conjunctions can be opened, but only one feeds the target.",
      "Try separating the block whose first symbol matches an implication toward V.",
      "U is a valid conclusion, just not the one this room asks for.",
    ],
    steps: [
      {
        inputs: ["Q ∧ S"],
        output: "Q",
        label: "Simplification",
        explanation: "Q can be extracted, though it leads only to a side result.",
      },
      {
        inputs: ["Q → U", "Q"],
        output: "U",
        label: "Modus Ponens",
        explanation: "The decoy branch reaches U cleanly, but the target lies elsewhere.",
      },
      {
        inputs: ["P ∧ R"],
        output: "P",
        label: "Simplification",
        explanation: "P is the useful part to take from the first conjunction.",
      },
      {
        inputs: ["P → T", "P"],
        output: "T",
        label: "Modus Ponens",
        explanation: "With P available, P → T moves the proof forward.",
      },
      {
        inputs: ["T → V", "T"],
        output: "V",
        label: "Modus Ponens",
        explanation: "The last implication completes the target.",
      },
    ],
  },
  {
    title: "Level 18 — Quiet Apex",
    subtitle: "The logic wing closes with a longer proof than it first appears.",
    target: "V",
    premises: ["¬¬P", "P → Q", "Q → R", "R → S", "S → V", "P → T", "T → U"],
    hints: [
      "Unwrap the opening premise before anything else can move.",
      "One branch from P is real, but it does not finish the room.",
      "The clean finish comes from compressing the middle of the chain.",
      "The last implication does not connect to P directly.",
    ],
    steps: [
      {
        inputs: ["¬¬P"],
        output: "P",
        label: "Double Negation",
        explanation: "The opening block resolves to the positive statement P.",
      },
      {
        inputs: ["P → T", "P"],
        output: "T",
        label: "Modus Ponens",
        explanation: "P can lead to T, though that branch is not the finish.",
      },
      {
        inputs: ["T → U", "T"],
        output: "U",
        label: "Modus Ponens",
        explanation: "The side branch continues cleanly to U, still short of the target.",
      },
      {
        inputs: ["S → V"],
        output: "¬V → ¬S",
        label: "Contraposition",
        explanation: "The final implication can be rewritten, but the new form is not needed.",
      },
      {
        inputs: ["Q → R", "R → S"],
        output: "Q → S",
        label: "Hypothetical Syllogism",
        explanation: "The middle of the chain compresses into a direct route from Q to S.",
      },
      {
        inputs: ["Q → S", "S → V"],
        output: "Q → V",
        label: "Hypothetical Syllogism",
        explanation: "Extending the shortened chain creates a direct implication from Q to V.",
      },
      {
        inputs: ["P → Q", "P"],
        output: "Q",
        label: "Modus Ponens",
        explanation: "Once P is known, P → Q provides the last missing premise.",
      },
      {
        inputs: ["Q → V", "Q"],
        output: "V",
        label: "Modus Ponens",
        explanation: "The compressed route closes the wing with a final step to V.",
      },
    ],
  },
];

const blocksElement = document.querySelector("#blocks");
const levelTitle = document.querySelector("#level-title");
const levelCount = document.querySelector("#level-count");
const levelNote = document.querySelector("#level-note");
const goal = document.querySelector("#goal");
const unknown = document.querySelector("#unknown");
const result = document.querySelector("#result");
const ruleLabel = document.querySelector("#rule-label");
const stepExplanation = document.querySelector("#step-explanation");
const hintText = document.querySelector("#hint-text");
const resetButton = document.querySelector("#reset-button");
const hintButton = document.querySelector("#hint-button");
const nextButton = document.querySelector("#next-button");
const soundToggle = document.querySelector("#sound-toggle");

const soundState = {
  context: null,
  masterGain: null,
  enabled: true,
};

let levelIndex = 0;
let blockState = [];
let selectedIds = [];
let solved = false;
let hintIndex = 0;
let hasPlayedCompleteSound = false;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!soundState.context) {
    soundState.context = new AudioContextClass();
    soundState.masterGain = soundState.context.createGain();
    soundState.masterGain.gain.value = 0.75;
    soundState.masterGain.connect(soundState.context.destination);
  }

  return soundState.context;
}

function withAudioContext(callback) {
  if (!soundState.enabled) {
    return;
  }

  const context = getAudioContext();

  if (!context || !soundState.masterGain) {
    return;
  }

  if (context.state === "suspended") {
    context.resume()
      .then(() => {
        if (soundState.enabled) {
          callback(context);
        }
      })
      .catch(() => {});

    return;
  }

  callback(context);
}

function scheduleTone(context, frequency, duration, type, volume, startTime) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const attack = Math.min(0.012, duration * 0.35);
  const releaseWindow = Math.min(0.045, duration * 0.5);
  const releaseStart = startTime + Math.max(attack, duration - releaseWindow);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0.001, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
  gainNode.gain.setValueAtTime(volume, releaseStart);
  gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(soundState.masterGain);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

function playToneSequence(tones) {
  withAudioContext((context) => {
    const baseTime = context.currentTime + 0.008;

    tones.forEach((tone) => {
      scheduleTone(
        context,
        tone.frequency,
        tone.duration,
        tone.type || "sine",
        tone.volume,
        baseTime + (tone.delay || 0),
      );
    });
  });
}

function playTone(frequency, duration, type = "sine", volume = 0.025) {
  playToneSequence([
    {
      frequency,
      duration,
      type,
      volume,
      delay: 0,
    },
  ]);
}

function playSelectSound() {
  playTone(520, 0.05, "sine", 0.018);
}

function playCorrectSound() {
  playToneSequence([
    { frequency: 660, duration: 0.07, type: "sine", volume: 0.022, delay: 0 },
    { frequency: 880, duration: 0.085, type: "sine", volume: 0.024, delay: 0.075 },
  ]);
}

function playWrongSound() {
  playTone(180, 0.12, "triangle", 0.02);
}

function playCompleteSound() {
  playToneSequence([
    { frequency: 523.25, duration: 0.08, type: "sine", volume: 0.022, delay: 0 },
    { frequency: 659.25, duration: 0.085, type: "sine", volume: 0.024, delay: 0.09 },
    { frequency: 783.99, duration: 0.11, type: "sine", volume: 0.026, delay: 0.19 },
  ]);
}

function updateSoundToggleLabel() {
  soundToggle.textContent = soundState.enabled ? "Sound: On" : "Sound: Off";
  soundToggle.setAttribute("aria-pressed", String(soundState.enabled));
}

function setSoundEnabled(value) {
  soundState.enabled = value;
  updateSoundToggleLabel();
}

function toggleSound() {
  setSoundEnabled(!soundState.enabled);
}

function createBlock(symbol, derived = false) {
  const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id: `${symbol}-${uniqueId}`,
    symbol,
    derived,
    disabled: false,
  };
}

function getCurrentLevel() {
  return levels[levelIndex];
}

function setStatus(message, type = "neutral", label = "") {
  result.textContent = message;
  result.className = type === "neutral" ? "result" : `result ${type}`;
  ruleLabel.textContent = label;
}

function setExplanation(message = "") {
  stepExplanation.textContent = message;
}

function setHint(message = "") {
  hintText.textContent = message;
}

function loadLevel(index) {
  levelIndex = index;
  solved = false;
  selectedIds = [];
  hintIndex = 0;
  hasPlayedCompleteSound = false;

  const level = getCurrentLevel();

  blockState = level.premises.map((symbol) => createBlock(symbol));

  levelTitle.textContent = level.title;
  levelCount.textContent = `${levelIndex + 1} / ${levels.length}`;
  levelNote.textContent = level.subtitle;
  goal.textContent = level.target;
  unknown.textContent = "?";
  unknown.classList.remove("solved");
  setStatus("Awaiting inference.");
  setExplanation("");
  setHint("");
  hintButton.disabled = false;
  hintButton.textContent = "Hint";
  nextButton.disabled = true;
  nextButton.textContent = levelIndex === levels.length - 1 ? "Complete" : "Next level";

  renderBlocks();
}

function renderBlocks() {
  blocksElement.innerHTML = "";

  blockState.forEach((block) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "symbol-block";
    button.textContent = block.symbol;
    button.dataset.id = block.id;

    if (block.derived) {
      button.classList.add("derived");
    }

    if (selectedIds.includes(block.id)) {
      button.classList.add("selected");
    }

    if (block.disabled) {
      button.disabled = true;
    }

    button.addEventListener("click", () => handleBlockClick(block.id));
    blocksElement.appendChild(button);
  });
}

function handleBlockClick(blockId) {
  if (solved) {
    return;
  }

  const wasSelected = selectedIds.includes(blockId);

  if (wasSelected) {
    selectedIds = selectedIds.filter((id) => id !== blockId);
  } else {
    selectedIds = [...selectedIds, blockId];
    playSelectSound();
  }

  syncSelectionState();
  evaluateSelection();
}

function syncSelectionState() {
  const blockButtons = blocksElement.querySelectorAll(".symbol-block");

  blockButtons.forEach((button) => {
    button.classList.toggle("selected", selectedIds.includes(button.dataset.id));
  });
}

function evaluateSelection() {
  const level = getCurrentLevel();
  const selectedSymbols = selectedIds
    .map((id) => blockState.find((block) => block.id === id)?.symbol)
    .filter(Boolean);

  if (selectedSymbols.length === 0) {
    setStatus("Awaiting inference.");
    setExplanation("");
    return;
  }

  const matchingStep = level.steps.find((step) => sameSymbols(step.inputs, selectedSymbols));

  if (matchingStep) {
    applyInference(matchingStep);
    return;
  }

  const partialMatch = level.steps.some((step) => isPartialSelection(step.inputs, selectedSymbols));

  if (partialMatch) {
    setStatus("Selection noted.");
    setExplanation("");
    return;
  }

  if (selectedSymbols.length >= 2) {
    showInvalidFeedback();
  }
}

function applyInference(step) {
  clearSelection();

  const outputExists = blockState.some((block) => block.symbol === step.output);

  if (!outputExists) {
    const newBlock = createBlock(step.output, true);
    blockState.push(newBlock);
    renderBlocks();

    const newestBlock = blocksElement.querySelector(`[data-id="${newBlock.id}"]`);
    if (newestBlock) {
      newestBlock.classList.add("newly-created");
      setTimeout(() => {
        newestBlock.classList.remove("newly-created");
      }, 1500);
    }
  }

  setStatus(`⊢ ${step.output}`, "success", step.label);
  setExplanation(step.explanation);

  if (step.output === getCurrentLevel().target) {
    completeLevel(step);
    return;
  }

  playCorrectSound();
}

function completeLevel(step) {
  solved = true;
  unknown.textContent = getCurrentLevel().target;
  unknown.classList.add("solved");
  setStatus("■ Q.E.D.", "success", step.label);
  setExplanation(step.explanation);
  hintButton.disabled = true;
  nextButton.disabled = false;

  blockState = blockState.map((block) => ({
    ...block,
    disabled: true,
  }));

  renderBlocks();

  if (!hasPlayedCompleteSound) {
    playCompleteSound();
    hasPlayedCompleteSound = true;
  }

  if (levelIndex === levels.length - 1) {
    nextButton.textContent = "All levels complete";
    nextButton.disabled = true;
    levelNote.textContent = "The room is quiet again.";
  }
}

function clearSelection() {
  selectedIds = [];
  syncSelectionState();
}

function showInvalidFeedback() {
  setStatus("⊬", "invalid");
  setExplanation("");
  clearSelection();
  playWrongSound();
  blocksElement.classList.remove("invalid");
  void blocksElement.offsetWidth;
  blocksElement.classList.add("invalid");
}

function showHint() {
  const hints = getCurrentLevel().hints;

  if (hints.length === 0) {
    setHint("No hints.");
    hintButton.textContent = "No hints";
    return;
  }

  const currentHint = hints[Math.min(hintIndex, hints.length - 1)];
  setHint(`Hint: ${currentHint}`);

  if (hintIndex < hints.length - 1) {
    hintIndex += 1;
  } else {
    hintButton.textContent = "Last hint shown";
  }
}

function sameSymbols(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  const leftCounts = countSymbols(left);
  const rightCounts = countSymbols(right);

  if (leftCounts.size !== rightCounts.size) {
    return false;
  }

  for (const [symbol, count] of leftCounts.entries()) {
    if (rightCounts.get(symbol) !== count) {
      return false;
    }
  }

  return true;
}

function isPartialSelection(stepInputs, chosenSymbols) {
  if (chosenSymbols.length >= stepInputs.length) {
    return false;
  }

  const stepCounts = countSymbols(stepInputs);
  const chosenCounts = countSymbols(chosenSymbols);

  for (const [symbol, count] of chosenCounts.entries()) {
    if ((stepCounts.get(symbol) || 0) < count) {
      return false;
    }
  }

  return true;
}

function countSymbols(symbols) {
  const counts = new Map();

  symbols.forEach((symbol) => {
    counts.set(symbol, (counts.get(symbol) || 0) + 1);
  });

  return counts;
}

resetButton.addEventListener("click", () => {
  loadLevel(levelIndex);
});

hintButton.addEventListener("click", () => {
  showHint();
});

nextButton.addEventListener("click", () => {
  if (levelIndex < levels.length - 1) {
    loadLevel(levelIndex + 1);
  }
});

soundToggle.addEventListener("click", () => {
  toggleSound();
});

updateSoundToggleLabel();
loadLevel(0);
