/**
 * Locked starting ink (Pack Rush, CR 10.2.2): the cards a match's starting
 * inkwell option puts into the inkwell carry `meta.lockedInInkwell`. They can't
 * be moved from the inkwell to any other zone (10.2.2.1) and can't be chosen
 * for effects (10.2.2.2). Kept free of imports so zone operations can use it.
 */

/** Whether a card's metadata marks it as locked starting ink. */
export function isLockedInkwellCardMeta(meta: unknown): boolean {
  return (
    typeof meta === "object" &&
    meta !== null &&
    (meta as { lockedInInkwell?: unknown }).lockedInInkwell === true
  );
}

/** Whether a zone key names an inkwell (`"inkwell"` or `"inkwell:<playerId>"`). */
export function isInkwellZoneKey(zoneKey: string | undefined): boolean {
  return zoneKey === "inkwell" || (typeof zoneKey === "string" && zoneKey.startsWith("inkwell:"));
}

/**
 * Whether a card is locked starting ink, read through a card query API. Tolerates
 * a context without `getMeta` (some unit-test contexts), reading it as unlocked.
 */
export function isLockedInkwellCard(
  cards: { getMeta?: (cardId: string) => unknown } | undefined,
  cardId: string,
): boolean {
  return typeof cards?.getMeta === "function" && isLockedInkwellCardMeta(cards.getMeta(cardId));
}
