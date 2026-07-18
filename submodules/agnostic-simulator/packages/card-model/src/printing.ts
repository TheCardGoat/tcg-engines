/**
 * A single physical printing / variant of a card.
 *
 * Identity hierarchy (see RFC §3): canonical → art → printing.
 * A printing is the most specific level (a concrete card object: set + collector
 * number + finish). Multiple printings may share one `artId` (same artwork across
 * sets); multiple arts may share one canonical id (alternate arts of the same card).
 */
export interface Printing {
  /** Printing identity — unique within a game (e.g. set + collector number + finish). */
  id: string;
  /** Art identity — stable across reprints of the same artwork. May equal `id` when art:printing is 1:1. */
  artId: string;
  /** Set code this printing belongs to (e.g. "GD01", "012", "boxtoppersretail"). */
  setCode: string;
  /** Printed collector number for this printing (e.g. "003", "β012", "GD01-001_p1"). */
  collectorNumber: string;
  /** Rarity tier of this printing (game-native string, e.g. "Epic", "rare", "enchanted"). */
  rarity: string;
  /** Asset URL for this printing's card image. */
  imageUrl: string;
  /** Provider-native identities for this exact physical printing. */
  externalIds?: Partial<Record<import("./external-source").ExternalSource, string>>;
}
