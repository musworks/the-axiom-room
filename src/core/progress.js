const STORAGE_KEYS = {
  highestCompletedLevelIndex: "axiomRoom.highestCompletedLevelIndex",
  lastOpenedLevelIndex: "axiomRoom.lastOpenedLevelIndex",
};

function readStoredIndex(key, fallback) {
  try {
    const value = Number.parseInt(localStorage.getItem(key), 10);
    return Number.isNaN(value) ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeStoredIndex(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {}
}

function clampLevelIndex(index, totalLevels, fallback) {
  if (index < 0 || index >= totalLevels) {
    return fallback;
  }

  return index;
}

export function loadSavedProgress(totalLevels) {
  const highestCompletedLevelIndex = readStoredIndex(
    STORAGE_KEYS.highestCompletedLevelIndex,
    -1,
  );
  const lastOpenedLevelIndex = readStoredIndex(
    STORAGE_KEYS.lastOpenedLevelIndex,
    0,
  );

  return {
    highestCompletedLevelIndex: Math.min(highestCompletedLevelIndex, totalLevels - 1),
    lastOpenedLevelIndex: clampLevelIndex(lastOpenedLevelIndex, totalLevels, 0),
  };
}

export function saveHighestCompletedLevelIndex(index) {
  writeStoredIndex(STORAGE_KEYS.highestCompletedLevelIndex, index);
}

export function saveLastOpenedLevelIndex(index) {
  writeStoredIndex(STORAGE_KEYS.lastOpenedLevelIndex, index);
}
