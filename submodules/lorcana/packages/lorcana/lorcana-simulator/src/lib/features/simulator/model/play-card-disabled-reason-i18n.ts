import {
  type PlayCardDisabledReason,
  assertNeverPlayCardDisabledReason,
} from "@tcg/lorcana-engine";
import { m } from "$lib/i18n/messages.js";

/**
 * Map a structured `PlayCardDisabledReason` from the engine to a localized
 * tooltip string. The engine never emits human-readable text — all wording
 * lives in `messages/*.json` under the `sim.playCard.disabled.<CODE>` keys.
 *
 * The switch is exhaustive: adding a new code to `PlayCardDisabledReason`
 * without a case here is a compile-time error via
 * `assertNeverPlayCardDisabledReason` in the default branch.
 */
export function formatPlayCardDisabledReason(reason: PlayCardDisabledReason): string {
  switch (reason.code) {
    case "NOT_IN_HAND":
      return m["sim.playCard.disabled.NOT_IN_HAND"]({});
    case "INSUFFICIENT_INK":
      return m["sim.playCard.disabled.INSUFFICIENT_INK"](reason.params);
    case "SHIFT_NO_TARGET":
      return m["sim.playCard.disabled.SHIFT_NO_TARGET"](reason.params);
    case "SHIFT_NO_DISCARD_AVAILABLE":
      return m["sim.playCard.disabled.SHIFT_NO_DISCARD_AVAILABLE"](reason.params);
    case "SHIFT_INSUFFICIENT_INK":
      return m["sim.playCard.disabled.SHIFT_INSUFFICIENT_INK"](reason.params);
    case "SONG_NO_SINGER":
      return m["sim.playCard.disabled.SONG_NO_SINGER"](reason.params);
    case "PLAYER_PLAY_RESTRICTED":
      return m["sim.playCard.disabled.PLAYER_PLAY_RESTRICTED"]({});
    case "SELF_PLAY_CONDITION_NOT_MET":
      return m["sim.playCard.disabled.SELF_PLAY_CONDITION_NOT_MET"]({});
    case "BAG_PENDING":
      return m["sim.playCard.disabled.BAG_PENDING"]({});
    case "UNKNOWN":
      return m["sim.playCard.disabled.UNKNOWN"]({});
    default:
      return assertNeverPlayCardDisabledReason(reason);
  }
}
