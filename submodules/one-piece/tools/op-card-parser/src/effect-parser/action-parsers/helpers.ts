import type { Duration } from "@tcg/op-types";

/**
 * Parse a duration suffix like "during this turn" / "during this battle".
 * Returns "permanent" when no duration is specified.
 */
export function parseDuration(text: string | undefined): Duration {
  if (!text) return "permanent";
  const lower = text.toLowerCase().trim();
  if (lower === "turn") return "thisTurn";
  if (lower === "battle") return "thisBattle";
  return "permanent";
}

/**
 * Parse a full duration phrase from action text.
 * Handles "during this turn", "until the start of your next turn",
 * "until the end of your opponent's next turn", etc.
 */
export function parseFullDuration(text: string): Duration {
  const lower = text.toLowerCase().trim();
  if (/during this turn/i.test(lower)) return "thisTurn";
  if (/during this battle/i.test(lower)) return "thisBattle";
  if (/until the start of your next turn/i.test(lower)) return "untilStartOfNextTurn";
  if (/until the end of your opponent'?s next turn/i.test(lower))
    return "untilEndOfOpponentNextTurn";
  if (/until the end of your opponent'?s next end phase/i.test(lower))
    return "untilEndOfOpponentNextEndPhase";
  return "permanent";
}
