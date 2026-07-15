export interface InteractionTargetGroup {
  readonly inputId: string;
  readonly targetIds: readonly string[];
  readonly minTargets: number;
  readonly maxTargets: number;
}

/**
 * Assign one flat, click-ordered target selection to the independently
 * published protocol inputs that constrain it.
 *
 * Candidates may belong to more than one group. A greedy per-group count is
 * therefore incorrect: a dual-trait card can satisfy either printed clause,
 * but it may only be submitted once. This small backtracking matcher handles
 * that overlap while keeping both the chosen-card order and protocol group
 * order deterministic.
 */
export function assignInteractionTargets(
  targetIds: readonly string[],
  groups: readonly InteractionTargetGroup[],
  options: { readonly requireMinimums: boolean } = { requireMinimums: true },
): readonly (readonly string[])[] | undefined {
  if (new Set(targetIds).size !== targetIds.length) return undefined;
  if (targetIds.length > groups.reduce((sum, group) => sum + group.maxTargets, 0)) {
    return undefined;
  }

  const candidateSets = groups.map((group) => new Set(group.targetIds));
  const eligibleGroups = new Map(
    targetIds.map((targetId) => [
      targetId,
      groups.flatMap((_, groupIndex) =>
        candidateSets[groupIndex]?.has(targetId) ? [groupIndex] : [],
      ),
    ]),
  );
  if ([...eligibleGroups.values()].some((eligible) => eligible.length === 0)) return undefined;

  // Scarce candidates are placed first so a flexible, overlapping candidate
  // cannot consume the only slot available to a single-group candidate.
  const searchOrder = targetIds
    .map((targetId, selectionIndex) => ({
      targetId,
      selectionIndex,
      eligible: eligibleGroups.get(targetId) ?? [],
    }))
    .toSorted(
      (a, b) => a.eligible.length - b.eligible.length || a.selectionIndex - b.selectionIndex,
    );
  const counts = groups.map(() => 0);
  const assignedGroupByTarget = new Map<string, number>();

  function search(index: number): boolean {
    if (index === searchOrder.length) {
      return groups.every(
        (group, groupIndex) =>
          counts[groupIndex]! <= group.maxTargets &&
          (!options.requireMinimums || counts[groupIndex]! >= group.minTargets),
      );
    }

    const current = searchOrder[index]!;
    for (const groupIndex of current.eligible) {
      const group = groups[groupIndex]!;
      if (counts[groupIndex]! >= group.maxTargets) continue;

      counts[groupIndex]! += 1;
      assignedGroupByTarget.set(current.targetId, groupIndex);
      if (search(index + 1)) return true;
      assignedGroupByTarget.delete(current.targetId);
      counts[groupIndex]! -= 1;
    }
    return false;
  }

  if (!search(0)) return undefined;

  return groups.map((_, groupIndex) =>
    targetIds.filter((targetId) => assignedGroupByTarget.get(targetId) === groupIndex),
  );
}
