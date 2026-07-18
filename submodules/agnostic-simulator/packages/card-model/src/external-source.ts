/**
 * Known external sources a card can be mapped to via `BaseCardDefinition.externalIds`.
 *
 * This is the closed set of source keys recognized by the platform catalog. Adding
 * a new source = extending this union (compile-time exhaustiveness check via
 * EXTERNAL_SOURCES). Games populate only the subset relevant to them.
 *
 * Naming convention: lowercase, camelCase for multi-word (e.g. `tcgPlayer`).
 * The same source always uses the same key in every game.
 *
 * Seed values verified against real game data (RFC §4 / Open Question 8):
 *  - `ravensburger`, `cultureInvariantId`, `lorcast`, `tcgPlayer`: real Lorcana keys.
 *  - `bandai`: forward-looking key for Bandai-published games (Gundam/One Piece/SWU).
 *
 * Note: Lorcana's native `cultureInvariantId` and `tcgPlayer` are `number` today;
 * the unified model coerces all values to `string` (RFC §10 Lorcana step 2).
 */
export type ExternalSource =
  | "ravensburger"
  | "cultureInvariantId"
  | "lorcast"
  | "tcgPlayer"
  | "tcgcsv"
  | "cardNexus"
  | "bandai";

export const EXTERNAL_SOURCES = [
  "ravensburger",
  "cultureInvariantId",
  "lorcast",
  "tcgPlayer",
  "tcgcsv",
  "cardNexus",
  "bandai",
] as const satisfies readonly ExternalSource[];

export function isExternalSource(value: unknown): value is ExternalSource {
  return typeof value === "string" && (EXTERNAL_SOURCES as readonly string[]).includes(value);
}
