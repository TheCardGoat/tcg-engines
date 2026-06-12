/**
 * Structured "why is the Play CTA disabled?" reasons for a card in hand.
 *
 * The engine emits codes + typed params only — no human-readable strings —
 * so the UI is the single source of truth for localization. Map each code
 * to a template in the i18n catalog (e.g. `playCard.disabled.INSUFFICIENT_INK`)
 * and substitute `params` into the template at render time.
 *
 * Returned by `LorcanaEngineBase.getPlayCardDisabledReason(cardInput)`:
 * - `null` means the card is playable right now (standard, shift, or sing).
 * - A `PlayCardDisabledReason` means the card cannot be played; the UI should
 *   render the button disabled with a tooltip explaining why.
 *
 * The type is a **discriminated union** on `code`, so:
 *   - Engine construction sites get a typecheck error if `params` don't match
 *     the code they're paired with.
 *   - Consumers (UI i18n catalog, telemetry, tests) can `switch (reason.code)`
 *     with exhaustive narrowing. Pair the switch with
 *     `assertNeverPlayCardDisabledReason` in the default branch to get a
 *     compile-time failure the moment a new reason code is added here.
 */
export type PlayCardDisabledReason =
  // The card isn't in the player's hand (or the input couldn't be resolved
  // to a card instance the player controls).
  | { code: "NOT_IN_HAND" }
  // Standard ink cost cannot be paid.
  | { code: "INSUFFICIENT_INK"; params: { needed: number; available: number } }
  // Shift cost: no character with a matching name is in the player's play zone
  // to be shifted onto.
  | { code: "SHIFT_NO_TARGET"; params: { targetName: string } }
  // Shift cost requires discarding N cards of a specific type, but the player
  // does not have enough qualifying cards in hand. `discardCardType` is one of
  // "action" | "song" | "character" | "item" | "location" | "card" (any).
  | {
      code: "SHIFT_NO_DISCARD_AVAILABLE";
      params: { discardCardType: string; count: number };
    }
  // Shift cost is ink-based and the player cannot pay it.
  | { code: "SHIFT_INSUFFICIENT_INK"; params: { needed: number; available: number } }
  // Song card has no eligible singer (no character in play with sufficient
  // cost to sing, and not enough ink to play normally).
  | { code: "SONG_NO_SINGER"; params: { songCost: number } }
  // A temporary or static restriction (e.g. an opponent card forbidding action
  // plays this turn) blocks this play.
  | { code: "PLAYER_PLAY_RESTRICTED" }
  // The card has a self-play condition that isn't currently satisfied
  // (e.g. "You can't play this character unless you have 5 or more characters
  // in play").
  | { code: "SELF_PLAY_CONDITION_NOT_MET" }
  // A pending effect (bag) must be resolved before another play can be made.
  | { code: "BAG_PENDING" }
  // Catch-all for other validateMove failures. The UI should render a generic
  // "This card can't be played right now" tooltip and ideally also log
  // `validateMoveErrorCode` so we can extend the taxonomy later.
  | { code: "UNKNOWN"; params: { validateMoveErrorCode: string } };

/**
 * String-literal union of every possible reason code. Useful for typing
 * i18n catalog keys or building a switch table outside of a
 * `PlayCardDisabledReason` value.
 */
export type PlayCardDisabledReasonCode = PlayCardDisabledReason["code"];

/**
 * Exhaustive list of every reason code at runtime, sorted alphabetically.
 *
 * The trailing `satisfies` assertion is the type-safety lever: if a new
 * variant is added to `PlayCardDisabledReason` and not appended here, the
 * file fails to compile. Use this list for catalog-completeness checks
 * (e.g. an i18n test that every code has a translation key) and for
 * runtime enumeration (e.g. building a switch table programmatically).
 */
export const KNOWN_PLAY_CARD_DISABLED_REASON_CODES = [
  "BAG_PENDING",
  "INSUFFICIENT_INK",
  "NOT_IN_HAND",
  "PLAYER_PLAY_RESTRICTED",
  "SELF_PLAY_CONDITION_NOT_MET",
  "SHIFT_INSUFFICIENT_INK",
  "SHIFT_NO_DISCARD_AVAILABLE",
  "SHIFT_NO_TARGET",
  "SONG_NO_SINGER",
  "UNKNOWN",
] as const satisfies readonly PlayCardDisabledReasonCode[];

// Compile-time completeness check the other direction: every code in the
// union must appear in the list. Together with the `satisfies` above, these
// two constraints make `KNOWN_PLAY_CARD_DISABLED_REASON_CODES` a tight
// bidirectional inventory of the union.
type _ListIsExhaustive =
  Exclude<
    PlayCardDisabledReasonCode,
    (typeof KNOWN_PLAY_CARD_DISABLED_REASON_CODES)[number]
  > extends never
    ? true
    : "Add the new code to KNOWN_PLAY_CARD_DISABLED_REASON_CODES";
const _exhaustivenessCheck: _ListIsExhaustive = true;
void _exhaustivenessCheck;

/**
 * Use in the `default` branch of a `switch (reason.code)` to force a
 * compile-time error the moment a new variant is added to
 * `PlayCardDisabledReason`. The runtime throw is defensive — TypeScript
 * should never let this code execute.
 *
 * @example
 *   switch (reason.code) {
 *     case "INSUFFICIENT_INK": return t("...", reason.params);
 *     // ... every other case ...
 *     default: return assertNeverPlayCardDisabledReason(reason);
 *   }
 */
export function assertNeverPlayCardDisabledReason(reason: never): never {
  const code = (reason as { code?: string } | null | undefined)?.code ?? "<unknown>";
  throw new Error(`Unhandled PlayCardDisabledReason code: ${code}`);
}
