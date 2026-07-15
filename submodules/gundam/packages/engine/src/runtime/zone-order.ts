/**
 * Ordered zones store their bottom card at index 0 and their top card at
 * the end of the array. Return the requested top cards in draw order.
 */
export function takeTopCards<T>(cards: readonly T[], count: number): T[] {
  const actualCount = Math.min(Math.max(0, Math.trunc(count)), cards.length);
  const topCards: T[] = [];

  for (let offset = 1; offset <= actualCount; offset++) {
    const card = cards.at(-offset);
    if (card !== undefined) topCards.push(card);
  }

  return topCards;
}
