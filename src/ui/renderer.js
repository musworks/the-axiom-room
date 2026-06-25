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
  onLevelSelect,
) {
  dom.levelSelector.innerHTML = "";

  for (let index = 0; index < totalLevels; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-button";
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Level ${index + 1}`);

    if (index <= highestCompletedLevelIndex) {
      button.classList.add("completed");
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

function formatStatCount(count, singularLabel, pluralLabel) {
  return `${count} ${count === 1 ? singularLabel : pluralLabel}`;
}

export function renderRunStats(stats) {
  dom.successfulSteps.textContent = String(stats.successfulSteps);
  dom.invalidAttempts.textContent = String(stats.invalidAttempts);
  dom.hintsUsed.textContent = String(stats.hintsUsed);

  if (stats.completed) {
    dom.completionSummary.textContent = [
      "Level complete.",
      `${formatStatCount(stats.successfulSteps, "successful step", "successful steps")},`,
      `${formatStatCount(stats.invalidAttempts, "invalid attempt", "invalid attempts")},`,
      `${formatStatCount(stats.hintsUsed, "hint used", "hints used")}.`,
    ].join(" ");
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
