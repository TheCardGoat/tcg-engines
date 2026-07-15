import type { EffectTrigger, Keyword } from "@tcg/op-types";

export const TRIGGER_MAP: Record<string, EffectTrigger> = {
  "on play": "onPlay",
  "when attacking": "whenAttacking",
  "on block": "onBlock",
  "on k.o.": "onKo",
  "end of your turn": "endOfYourTurn",
  "end of your opponent's turn": "endOfOpponentTurn",
  "on your opponent's attack": "onOpponentAttack",
  "activate:main": "activateMain",
  "activate: main": "activateMain",
  main: "main",
  counter: "counter",
  trigger: "trigger",
};

/** Known keyword brackets — skip during prefix chain parsing */
export const KEYWORD_BRACKETS = new Set([
  "rush",
  "rush: character",
  "double attack",
  "banish",
  "blocker",
  "unblockable",
]);

export const KEYWORD_BRACKET_TO_TYPE: Record<string, Keyword> = {
  rush: "rush",
  "rush: character": "rushCharacter",
  "double attack": "doubleAttack",
  banish: "banish",
  blocker: "blocker",
  unblockable: "unblockable",
};

/**
 * Regex that matches a keyword bracket only when it is NOT preceded by
 * context that indicates a card-reference usage (e.g., "a card with a [Blocker]").
 */
export const KEYWORD_REFERENCE_PREFIX =
  /(?:with\s+(?:a\s+)?|have\s+|has\s+|gain(?:s)?\s+|give(?:s)?\s+|loses?\s+|without\s+|activate\s+(?:a\s+)?)$/i;

/** Well-known keyword explanations to strip */
export const KEYWORD_EXPLANATIONS: RegExp[] = [
  /\[Rush\]\s*\([^)]*can attack[^)]*\)/gi,
  /\[Rush: Character\]\s*\([^)]*can attack[^)]*\)/gi,
  /\[Blocker\]\s*\([^)]*declares an attack[^)]*\)/gi,
  /\[Double Attack\]\s*\([^)]*deals 2 damage[^)]*\)/gi,
  /\[Banish\]\s*\([^)]*deals damage[^)]*\)/gi,
  /\[Unblockable\]\s*\([^)]*cannot activate[^)]*\)/gi,
];

/** DON!! cost reminder parentheticals */
export const DON_REMINDERS: RegExp[] = [
  /\s*\(You may rest the specified number of DON!! cards in your cost area\.?\)\s*/gi,
  /\s*\(You may return the specified number of DON!! cards from your field to your DON!! deck\.?\)\s*/gi,
];

/**
 * All known trigger bracket patterns for the secondary split.
 * Used to detect where a new effect segment begins when there's no newline.
 */
export const TRIGGER_BRACKET_RE =
  /\[(On Play|When Attacking|On Block|On K\.O\.|End of Your Turn|End of Your Opponent's Turn|On Your Opponent's Attack|Activate:\s*Main|Main|Counter|Trigger|Once Per Turn|Your Turn|Opponent's Turn|DON!!\s*[x×]\s*\d+)\]/i;

/**
 * Match "Draw N card(s)" patterns. Captures the amount.
 * Handles: "Draw 1 card", "Draw 2 cards", "draw 1 card"
 */
export const DRAW_RE =
  /^draw (?:up to )?(\d+) cards?(?:\s+if\s+you\s+have\s+(\d+)\s+or\s+(less|more)\s+(?:DON!!\s+)?cards?\s+(?:in\s+your\s+hand|on\s+your\s+field)(?:\s+and\s+.+)?)?\.?$/i;

export const TRIGGER_MAP_ACTIVATE: Record<string, EffectTrigger> = {
  main: "main",
  counter: "counter",
  "activate:main": "activateMain",
  "activate: main": "activateMain",
  "on play": "onPlay",
  "when attacking": "whenAttacking",
  "on block": "onBlock",
  "on k.o.": "onKo",
  trigger: "trigger",
};
