/**
 * Exact for ordinary hand-sized decisions. Larger searches keep a bounded,
 * deterministic set of alternatives, including both selection extremes.
 */
export const MAX_DECISION_CANDIDATES = 256;

export function selectionCandidates(
  ids: readonly string[],
  min: number,
  max: number,
): readonly (readonly string[])[] {
  const choices: string[][] = [];
  const seen = new Set<string>();
  const upper = Math.min(max, ids.length);
  const emit = (choice: readonly string[]) => {
    if (choice.length < min || choice.length > upper || choices.length >= MAX_DECISION_CANDIDATES)
      return;
    const key = JSON.stringify(choice);
    if (seen.has(key)) return;
    seen.add(key);
    choices.push([...choice]);
  };
  emit(ids.slice(0, min));
  emit(ids.slice(0, upper));
  for (const id of ids) emit([id]);
  const visit = (start: number, size: number, chosen: readonly string[]) => {
    if (choices.length >= MAX_DECISION_CANDIDATES) return;
    if (chosen.length === size) return emit(chosen);
    for (let index = start; index <= ids.length - (size - chosen.length); index++) {
      visit(index + 1, size, [...chosen, ids[index]!]);
      if (choices.length >= MAX_DECISION_CANDIDATES) break;
    }
  };
  for (let size = min; size <= upper && choices.length < MAX_DECISION_CANDIDATES; size++)
    visit(0, size, []);
  return choices;
}

export function orderingCandidates(ids: readonly string[]): readonly (readonly string[])[] {
  if (ids.length > 5) {
    // Pitch order and most trigger orders are small. Preserve several complete
    // orders without factorial allocation when a large trigger batch arrives.
    return [
      ids,
      [...ids].reverse(),
      ...ids
        .slice(1, MAX_DECISION_CANDIDATES - 1)
        .map((_, index) => [...ids.slice(index + 1), ...ids.slice(0, index + 1)]),
    ];
  }
  const choices: string[][] = [];
  const visit = (chosen: readonly string[], remaining: readonly string[]) => {
    if (remaining.length === 0) {
      choices.push([...chosen]);
      return;
    }
    for (const [index, id] of remaining.entries())
      visit(
        [...chosen, id],
        remaining.filter((_, i) => i !== index),
      );
  };
  visit([], ids);
  return choices;
}

export function partitionCandidates(
  ids: readonly string[],
  groupIds: readonly string[],
): readonly Readonly<Record<string, readonly string[]>>[] {
  const choices: Record<string, string[]>[] = [];
  if (groupIds.length === 0) return choices;
  // Ensure every destination can receive the whole set, even at the budget.
  for (const group of groupIds)
    choices.push(Object.fromEntries(groupIds.map((id) => [id, id === group ? [...ids] : []])));
  const visit = (index: number, assignments: readonly string[]) => {
    if (choices.length >= MAX_DECISION_CANDIDATES) return;
    if (index === ids.length) {
      choices.push(
        Object.fromEntries(groupIds.map((id) => [id, ids.filter((_, i) => assignments[i] === id)])),
      );
      return;
    }
    for (const group of groupIds) visit(index + 1, [...assignments, group]);
  };
  visit(0, []);
  return choices;
}
