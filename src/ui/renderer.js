import { dom } from "./dom.js";

export function renderLevel(level, levelIndex, totalLevels) {
  dom.levelTitle.textContent = level.title;
  dom.levelCount.textContent = `Level ${levelIndex + 1} / ${totalLevels}`;
  dom.levelNote.textContent = level.subtitle;
  dom.goal.textContent = level.target;
  dom.unknown.textContent = "?";
  dom.unknown.classList.remove("solved");
  setStatus("Awaiting inference.");
  setExplanation("");
  setHint("");
  clearProofLog();
  dom.hintButton.disabled = false;
  dom.hintButton.textContent = "Hint";
  dom.nextButton.disabled = true;
  dom.nextButton.textContent = levelIndex === totalLevels - 1 ? "Complete" : "Next level";
}

export function renderBlocks(blockState, selectedIds, onBlockClick) {
  dom.blocksElement.innerHTML = "";

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

    button.addEventListener("click", () => onBlockClick(block.id));
    dom.blocksElement.appendChild(button);
  });
}

export function renderLevelSelector(
  totalLevels,
  currentLevelIndex,
  highestCompletedLevelIndex,
  bestRecords,
  onLevelSelect,
) {
  dom.levelSelector.innerHTML = "";

  for (let index = 0; index < totalLevels; index += 1) {
    const bestRecord = bestRecords[index];
    const isCleanSolved = bestRecord
      && bestRecord.invalidAttempts === 0
      && bestRecord.hintsUsed === 0;
    const isCompleted = index <= highestCompletedLevelIndex || Boolean(bestRecord);
    const badge = isCleanSolved ? "★" : isCompleted ? "✓" : "";
    const statusLabel = isCleanSolved ? ", clean solved" : isCompleted ? ", completed" : "";
    const button = document.createElement("button");
    const levelNumber = document.createElement("span");

    button.type = "button";
    button.className = "level-button";
    button.setAttribute("aria-label", `Level ${index + 1}${statusLabel}`);

    levelNumber.className = "level-button__number";
    levelNumber.textContent = String(index + 1);
    button.appendChild(levelNumber);

    if (badge) {
      const badgeElement = document.createElement("span");
      badgeElement.className = "level-button__badge";
      badgeElement.textContent = badge;
      badgeElement.setAttribute("aria-hidden", "true");
      button.appendChild(badgeElement);
    }

    if (isCompleted) {
      button.classList.add("completed");
    }

    if (isCleanSolved) {
      button.classList.add("clean-solved");
    }

    if (index === currentLevelIndex) {
      button.classList.add("current");
      button.setAttribute("aria-current", "true");
    }

    button.addEventListener("click", () => onLevelSelect(index));
    dom.levelSelector.appendChild(button);
  }
}

export function syncSelectionState(selectedIds) {
  const blockButtons = dom.blocksElement.querySelectorAll(".symbol-block");

  blockButtons.forEach((button) => {
    button.classList.toggle("selected", selectedIds.includes(button.dataset.id));
  });
}

export function markBlockNewlyCreated(blockId) {
  const newestBlock = dom.blocksElement.querySelector(`[data-id="${blockId}"]`);

  if (newestBlock) {
    newestBlock.classList.add("newly-created");
    setTimeout(() => {
      newestBlock.classList.remove("newly-created");
    }, 1500);
  }
}

export function setStatus(message, type = "neutral", label = "") {
  dom.result.textContent = message;
  dom.result.className = type === "neutral" ? "result" : `result ${type}`;
  dom.ruleLabel.textContent = label;
}

export function setExplanation(message = "") {
  dom.stepExplanation.textContent = message;
}

export function setHint(message = "") {
  dom.hintText.textContent = message;
}

export function appendProofLogEntry(inputSymbols, outputSymbol, ruleLabel) {
  const entry = document.createElement("li");
  entry.textContent = `${inputSymbols.join(", ")} ⊢ ${outputSymbol} — ${ruleLabel}`;
  dom.proofLog.appendChild(entry);
}

export function clearProofLog() {
  dom.proofLog.innerHTML = "";
}

export function renderInvalidSelection() {
  dom.blocksElement.classList.remove("invalid");
  void dom.blocksElement.offsetWidth;
  dom.blocksElement.classList.add("invalid");
}

function formatStatCount(value, singularLabel, pluralLabel) {
  return `${value} ${value === 1 ? singularLabel : pluralLabel}`;
}

function renderRecordValues(record, elements) {
  elements.successfulSteps.textContent = String(record.successfulSteps);
  elements.invalidAttempts.textContent = String(record.invalidAttempts);
  elements.hintsUsed.textContent = String(record.hintsUsed);
}

export function renderRunStats(stats, bestRecord = null, isNewBest = false) {
  renderRecordValues(stats, {
    successfulSteps: dom.successfulSteps,
    invalidAttempts: dom.invalidAttempts,
    hintsUsed: dom.hintsUsed,
  });

  if (bestRecord) {
    renderRecordValues(bestRecord, {
      successfulSteps: dom.bestSuccessfulSteps,
      invalidAttempts: dom.bestInvalidAttempts,
      hintsUsed: dom.bestHintsUsed,
    });
    dom.bestRecordEmpty.hidden = true;
    dom.bestRecordList.hidden = false;
  } else {
    renderRecordValues(
      { successfulSteps: 0, invalidAttempts: 0, hintsUsed: 0 },
      {
        successfulSteps: dom.bestSuccessfulSteps,
        invalidAttempts: dom.bestInvalidAttempts,
        hintsUsed: dom.bestHintsUsed,
      },
    );
    dom.bestRecordEmpty.hidden = false;
    dom.bestRecordList.hidden = true;
  }

  if (stats.completed) {
    const summary = [
      "Level complete.",
      `${formatStatCount(stats.successfulSteps, "successful step", "successful steps")},`,
      `${formatStatCount(stats.invalidAttempts, "invalid attempt", "invalid attempts")},`,
      `${formatStatCount(stats.hintsUsed, "hint used", "hints used")}.`,
    ];

    if (isNewBest) {
      summary.push("New best record.");
    }

    dom.completionSummary.textContent = summary.join(" ");
    dom.completionSummary.hidden = false;
  } else {
    dom.completionSummary.textContent = "";
    dom.completionSummary.hidden = true;
  }
}

export function renderLevelComplete(target, label, explanation) {
  dom.unknown.textContent = target;
  dom.unknown.classList.add("solved");
  setStatus("■ Q.E.D.", "success", label);
  setExplanation(explanation);
  dom.hintButton.disabled = true;
  dom.nextButton.disabled = false;
}

export function renderAllLevelsComplete() {
  dom.nextButton.textContent = "All levels complete";
  dom.nextButton.disabled = true;
  dom.levelNote.textContent = "The room is quiet again.";
}

export function renderHintButtonLastHint() {
  dom.hintButton.textContent = "Last hint shown";
}

export function renderNoHints() {
  setHint("No hints.");
  dom.hintButton.textContent = "No hints";
}

export function renderSoundToggle(enabled) {
  dom.soundToggle.textContent = enabled ? "Sound: On" : "Sound: Off";
  dom.soundToggle.setAttribute("aria-pressed", String(enabled));
}

export function showInspectorPanel(panelName) {
  const tabPairs = [
    [dom.proofLogTab, dom.proofLogPanel, panelName === "proof-log"],
    [dom.statsTab, dom.statsPanel, panelName === "stats"],
    [dom.levelsTab, dom.levelsPanel, panelName === "levels"],
  ];

  tabPairs.forEach(([tab, panel, isActive]) => {
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}
