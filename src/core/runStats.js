const INITIAL_STATS = {
  successfulSteps: 0,
  invalidAttempts: 0,
  hintsUsed: 0,
  completed: false,
};

let stats = { ...INITIAL_STATS };

function copyStats() {
  return { ...stats };
}

export function resetRunStats() {
  stats = { ...INITIAL_STATS };
  return copyStats();
}

export function recordSuccessfulStep() {
  stats = {
    ...stats,
    successfulSteps: stats.successfulSteps + 1,
  };

  return copyStats();
}

export function recordInvalidAttempt() {
  stats = {
    ...stats,
    invalidAttempts: stats.invalidAttempts + 1,
  };

  return copyStats();
}

export function recordHintUsed() {
  stats = {
    ...stats,
    hintsUsed: stats.hintsUsed + 1,
  };

  return copyStats();
}

export function recordRunComplete() {
  stats = {
    ...stats,
    completed: true,
  };

  return copyStats();
}
