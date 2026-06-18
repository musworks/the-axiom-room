import { levels } from "./data/levels.js";
import {
  isSoundEnabled,
  playCompleteSound,
  playCorrectSound,
  playSelectSound,
  playWrongSound,
  toggleSound,
} from "./audio/sound.js";
import { createBlock } from "./core/blocks.js";
import { findMatchingStep, getSelectedSymbols, hasPartialMatch } from "./core/proofEngine.js";
import { dom } from "./ui/dom.js";
import {
  appendProofLogEntry,
  markBlockNewlyCreated,
  renderAllLevelsComplete,
  renderBlocks,
  renderHintButtonLastHint,
  renderInvalidSelection,
  renderLevel,
  renderLevelComplete,
  renderNoHints,
  renderSoundToggle,
  setExplanation,
  setHint,
  setStatus,
  syncSelectionState,
} from "./ui/renderer.js";

let levelIndex = 0;
let blockState = [];
let selectedIds = [];
let solved = false;
let hintIndex = 0;
let hasPlayedCompleteSound = false;

function getCurrentLevel() {
  return levels[levelIndex];
}

function loadLevel(index) {
  levelIndex = index;
  solved = false;
  selectedIds = [];
  hintIndex = 0;
  hasPlayedCompleteSound = false;

  const level = getCurrentLevel();

  blockState = level.premises.map((symbol) => createBlock(symbol));

  renderLevel(level, levelIndex, levels.length);
  renderBlocks(blockState, selectedIds, handleBlockClick);
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

  syncSelectionState(selectedIds);
  evaluateSelection();
}

function evaluateSelection() {
  const level = getCurrentLevel();
  const selectedSymbols = getSelectedSymbols(blockState, selectedIds);

  if (selectedSymbols.length === 0) {
    setStatus("Awaiting inference.");
    setExplanation("");
    return;
  }

  const matchingStep = findMatchingStep(level.steps, selectedSymbols);

  if (matchingStep) {
    applyInference(matchingStep, selectedSymbols);
    return;
  }

  const partialMatch = hasPartialMatch(level.steps, selectedSymbols);

  if (partialMatch) {
    setStatus("Selection noted.");
    setExplanation("");
    return;
  }

  if (selectedSymbols.length >= 2) {
    showInvalidFeedback();
  }
}

function applyInference(step, inputSymbols) {
  clearSelection();

  const outputExists = blockState.some((block) => block.symbol === step.output);

  if (!outputExists) {
    const newBlock = createBlock(step.output, true);
    blockState.push(newBlock);
    renderBlocks(blockState, selectedIds, handleBlockClick);
    markBlockNewlyCreated(newBlock.id);
  }

  setStatus(`⊢ ${step.output}`, "success", step.label);
  setExplanation(step.explanation);
  appendProofLogEntry(inputSymbols, step.output, step.label);

  if (step.output === getCurrentLevel().target) {
    completeLevel(step);
    return;
  }

  playCorrectSound();
}

function completeLevel(step) {
  solved = true;
  renderLevelComplete(getCurrentLevel().target, step.label, step.explanation);

  blockState = blockState.map((block) => ({
    ...block,
    disabled: true,
  }));

  renderBlocks(blockState, selectedIds, handleBlockClick);

  if (!hasPlayedCompleteSound) {
    playCompleteSound();
    hasPlayedCompleteSound = true;
  }

  if (levelIndex === levels.length - 1) {
    renderAllLevelsComplete();
  }
}

function clearSelection() {
  selectedIds = [];
  syncSelectionState(selectedIds);
}

function showInvalidFeedback() {
  setStatus("⊬", "invalid");
  setExplanation("");
  clearSelection();
  playWrongSound();
  renderInvalidSelection();
}

function showHint() {
  const hints = getCurrentLevel().hints;

  if (hints.length === 0) {
    renderNoHints();
    return;
  }

  const currentHint = hints[Math.min(hintIndex, hints.length - 1)];
  setHint(`Hint: ${currentHint}`);

  if (hintIndex < hints.length - 1) {
    hintIndex += 1;
  } else {
    renderHintButtonLastHint();
  }
}

dom.resetButton.addEventListener("click", () => {
  loadLevel(levelIndex);
});

dom.hintButton.addEventListener("click", () => {
  showHint();
});

dom.nextButton.addEventListener("click", () => {
  if (levelIndex < levels.length - 1) {
    loadLevel(levelIndex + 1);
  }
});

dom.soundToggle.addEventListener("click", () => {
  renderSoundToggle(toggleSound());
});

renderSoundToggle(isSoundEnabled());
loadLevel(0);
