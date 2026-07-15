import type { ExternalSource } from "./external-source.js";
import type { Printing } from "./printing.js";

/**
 * Mandatory base shape every game's catalog card definition extends.
 *
 * Enforces one consistent naming convention for card identity across all games
 * (RFC §7 / ADR-11). Each game's card type `extends BaseCardDefinition` (structurally
 * or via interface inheritance) and adds only its game-specific fields.
 *
 * Identity hierarchy: canonical (this) → art → printing.
 *  - Canonical uniqueness anchor: `(gameSlug, canonicalId)`.
 *  - Art uniqueness anchor: `(gameSlug, printing.artId)`.
 *  - Printing uniqueness anchor: `(gameSlug, printing.id)`.
 *
 * `slug` is URL-facing and language-stable; it is NOT a uniqueness anchor (RFC ADR-8).
 */
export interface BaseCardDefinition {
  /** Canonical gameplay identity — stable across all reprints/arts of the same card. */
  canonicalId: string;
  /** URL-facing, language-stable slug. NOT a uniqueness anchor (RFC ADR-8). */
  slug: string;
  /** Display name. Games may add `displayName`/`subtitle`/`version`/`i18n` alongside. */
  name: string;
  /** All printings of this card. At least one. Each carries `id` + `artId`. */
  printings: readonly Printing[];
  /**
   * Optional dictionary mapping this card to external sources (vendors, publishers,
   * canonical registries). Populated with only the sources relevant to the game.
   * Absent/empty when a game has no external ids (e.g. One Piece, SWU today).
   *
   * Keyed by `ExternalSource` (typed union); adding a source = extending the union.
   */
  externalIds?: Partial<Record<ExternalSource, string>>;
}
