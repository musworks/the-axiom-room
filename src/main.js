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
import { getBestRecord, saveBestRecord } from "./core/bestRecords.js";
import { findMatchingStep, getSelectedSymbols, hasPartialMatch } from "./core/proofEngine.js";
import {
  loadSavedProgress,
  saveHighestCompletedLevelIndex,
  saveLastOpenedLevelIndex,
} from "./core/progress.js";
import {
  recordHintUsed,
  recordInvalidAttempt,
  recordRunComplete,
  recordSuccessfulStep,
  resetRunStats,
} from "./core/runStats.js";
import { dom } from "./ui/dom.js";
import {
  appendProofLogEntry,
  markBlockNewlyCreated,
  renderAllLevelsComplete,
  renderBlocks,
  renderHintButtonLastHint,
  renderInvalidSelection,
  renderLevel,
  renderLevelSelector,
  renderLevelComplete,
  renderNoHints,
  renderRunStats,
  renderSoundToggle,
  setExplanation,
  setHint,
  setStatus,
  showInspectorPanel,
  syncSelectionState,
} from "./ui/renderer.js";

let levelIndex = 0;
let blockState = [];
let selectedIds = [];
let solved = false;
let hintIndex = 0;
let hasPlayedCompleteSound = false;
let highestCompletedLevelIndex = -1;
let bestRecord = null;

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
  bestRecord = getBestRecord(levelIndex);

  blockState = level.premises.map((symbol) => createBlock(symbol));

  renderLevel(level, levelIndex, levels.length);
  renderLevelSelector(
    levels.length,
    levelIndex,
    highestCompletedLevelIndex,
    handleLevelSelect,
  );
  renderBlocks(blockState, selectedIds, handleBlockClick);
  renderRunStats(resetRunStats(), bestRecord);
  saveLastOpenedLevelIndex(levelIndex);
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

  if (outputExists) {
    setStatus("Already derived.");
    setExplanation("");
    return;
  }

  const newBlock = createBlock(step.output, true);
  blockState.push(newBlock);
  renderBlocks(blockState, selectedIds, handleBlockClick);
  markBlockNewlyCreated(newBlock.id);

  setStatus(`⊢ ${step.output}`, "success", step.label);
  setExplanation(step.explanation);
  appendProofLogEntry(inputSymbols, step.output, step.label);
  renderRunStats(recordSuccessfulStep(), bestRecord);

  if (step.output === getCurrentLevel().target) {
    completeLevel(step);
    return;
  }

  playCorrectSound();
}

function completeLevel(step) {
  solved = true;
  const completedStats = recordRunComplete();
  const bestRecordResult = saveBestRecord(levelIndex, completedStats);
  bestRecord = bestRecordResult.record;
  renderRunStats(completedStats, bestRecord, bestRecordResult.isNewBest);
  renderLevelComplete(getCurrentLevel().target, step.label, step.explanation);

  if (levelIndex > highestCompletedLevelIndex) {
    highestCompletedLevelIndex = levelIndex;
    saveHighestCompletedLevelIndex(highestCompletedLevelIndex);
    renderLevelSelector(
      levels.length,
      levelIndex,
      highestCompletedLevelIndex,
      handleLevelSelect,
    );
  }

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
  renderRunStats(recordInvalidAttempt(), bestRecord);
  renderInvalidSelection();
}

function showHint() {
  const hints = getCurrentLevel().hints;

  if (hints.length === 0) {
    renderNoHints();
    return;
  }

  const isNewHint = hintIndex < hints.length;
  const currentHint = hints[Math.min(hintIndex, hints.length - 1)];
  setHint(`Hint: ${currentHint}`);

  if (isNewHint) {
    hintIndex += 1;
    renderRunStats(recordHintUsed(), bestRecord);
  }

  if (hintIndex >= hints.length) {
    renderHintButtonLastHint();
  }
}

function handleLevelSelect(index) {
  loadLevel(index);
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

dom.proofLogTab.addEventListener("click", () => {
  showInspectorPanel("proof-log");
});

dom.statsTab.addEventListener("click", () => {
  showInspectorPanel("stats");
});

dom.levelsTab.addEventListener("click", () => {
  showInspectorPanel("levels");
});

dom.openLevelsButton.addEventListener("click", () => {
  showInspectorPanel("levels");
});

dom.soundToggle.addEventListener("click", () => {
  renderSoundToggle(toggleSound());
});

renderSoundToggle(isSoundEnabled());

const savedProgress = loadSavedProgress(levels.length);
highestCompletedLevelIndex = savedProgress.highestCompletedLevelIndex;
loadLevel(savedProgress.lastOpenedLevelIndex);
