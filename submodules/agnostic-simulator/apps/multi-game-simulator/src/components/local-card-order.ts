/** Reorder only selected display slots. Native collections and other slots stay unchanged. */
export function arrangeCardSlots<T>(
  cards: readonly T[],
  inLocalHand: (card: T) => boolean,
  cardId: (card: T) => string,
  order: readonly string[],
): T[] {
  const byId = new Map(cards.filter(inLocalHand).map((card) => [cardId(card), card]));
  const ordered: T[] = [];
  for (const id of order) {
    const card = byId.get(id);
    if (card) {
      ordered.push(card);
      byId.delete(id);
    }
  }
  ordered.push(...byId.values());
  let index = 0;
  return cards.map((card) => (inLocalHand(card) ? ordered[index++]! : card));
}

export function moveCardInLocalOrder(
  ids: readonly string[],
  id: string,
  direction: -1 | 1,
): string[] {
  const result = [...ids];
  const from = result.indexOf(id),
    to = from + direction;
  if (from < 0 || to < 0 || to >= result.length) return result;
  [result[from], result[to]] = [result[to]!, result[from]!];
  return result;
}
