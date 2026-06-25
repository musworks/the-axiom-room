const STORAGE_KEY = "axiomRoom.bestRecords";
const RECORD_FIELDS = ["successfulSteps", "invalidAttempts", "hintsUsed"];

function normalizeRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const normalized = {};

  for (const field of RECORD_FIELDS) {
    const value = Number(record[field]);

    if (!Number.isInteger(value) || value < 0) {
      return null;
    }

    normalized[field] = value;
  }

  return normalized;
}

function readRecords() {
  try {
    const storedRecords = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return storedRecords && typeof storedRecords === "object" ? storedRecords : {};
  } catch {
    return {};
  }
}

function writeRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

export function isBetterRecord(candidate, current) {
  if (!current) {
    return true;
  }

  if (candidate.hintsUsed !== current.hintsUsed) {
    return candidate.hintsUsed < current.hintsUsed;
  }

  if (candidate.invalidAttempts !== current.invalidAttempts) {
    return candidate.invalidAttempts < current.invalidAttempts;
  }

  return candidate.successfulSteps < current.successfulSteps;
}

export function getBestRecord(levelIndex) {
  const records = readRecords();
  return normalizeRecord(records[String(levelIndex)]);
}

export function saveBestRecord(levelIndex, stats) {
  const candidate = normalizeRecord(stats);

  if (!candidate) {
    return {
      record: getBestRecord(levelIndex),
      isNewBest: false,
    };
  }

  const records = readRecords();
  const key = String(levelIndex);
  const current = normalizeRecord(records[key]);

  if (!isBetterRecord(candidate, current)) {
    return {
      record: current,
      isNewBest: false,
    };
  }

  records[key] = candidate;
  writeRecords(records);

  return {
    record: candidate,
    isNewBest: true,
  };
}
