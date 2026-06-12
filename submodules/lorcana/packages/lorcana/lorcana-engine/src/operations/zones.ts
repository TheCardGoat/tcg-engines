/**
 * Returns true when `zoneKey` denotes a "play" zone (including sub-zones like
 * `play:locations`). Use when the caller has already fetched the zoneKey to
 * avoid a redundant zone read and a possible inconsistency between the
 * condition and a snapshot of the zoneKey value.
 */
export function isPlayZoneKey(zoneKey: string | undefined): zoneKey is string {
  return typeof zoneKey === "string" && (zoneKey === "play" || zoneKey.startsWith("play:"));
}

/**
 * Returns true when the card is in any "play" zone (including sub-zones like
 * `play:locations`). Three move files previously inlined this check.
 */
export function isCardInPlayZone(
  ctx: { framework: { zones: { getCardZone: (cardId: string) => string | undefined } } },
  cardId: string,
): boolean {
  return isPlayZoneKey(ctx.framework.zones.getCardZone(cardId));
}
