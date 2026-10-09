export function getRevealCardCostCandidateGroups<TCardId extends string>(
  handCards: readonly TCardId[],
  count: number,
  requireSameName: boolean,
  getName: (cardId: TCardId) => string | undefined,
): TCardId[][] {
  if (!requireSameName) return handCards.length >= count ? [[...handCards]] : [];
  const groups = new Map<string, TCardId[]>();
  for (const cardId of handCards) {
    const name = getName(cardId);
    if (!name) continue;
    const group = groups.get(name) ?? [];
    group.push(cardId);
    groups.set(name, group);
  }
  return [...groups.values()].filter((group) => group.length >= count);
}
