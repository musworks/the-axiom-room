export function createBlock(symbol, derived = false) {
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
