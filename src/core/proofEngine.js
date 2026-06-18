export function getSelectedSymbols(blockState, selectedIds) {
  return selectedIds
    .map((id) => blockState.find((block) => block.id === id)?.symbol)
    .filter(Boolean);
}

export function findMatchingStep(steps, selectedSymbols) {
  return steps.find((step) => sameSymbols(step.inputs, selectedSymbols));
}

export function hasPartialMatch(steps, selectedSymbols) {
  return steps.some((step) => isPartialSelection(step.inputs, selectedSymbols));
}

export function sameSymbols(left, right) {
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

export function isPartialSelection(stepInputs, chosenSymbols) {
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

export function countSymbols(symbols) {
  const counts = new Map();

  symbols.forEach((symbol) => {
    counts.set(symbol, (counts.get(symbol) || 0) + 1);
  });

  return counts;
}
