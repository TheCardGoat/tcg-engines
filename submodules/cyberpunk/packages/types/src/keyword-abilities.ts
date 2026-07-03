import type { Ability, CardKeyword, HostTargetDSL, SelfTargetDSL } from "./index.ts";

/**
 * Options shared by every keyword-ability factory.
 *
 * The canonical reminder text for each keyword lives in {@link DEFAULT_TEXT}.
 * Pass `text` only when a card prints a different reminder than the canonical
 * one (the override is preserved verbatim — display/log copy, not gameplay
 * branching). Pass `host: true` when the keyword is granted by a gear to its
 * host instead of to the card itself.
 */
export interface KeywordAbilityOptions {
  /** Override the canonical reminder text. Pass the card's exact current string. */
  text?: string;
  /** Use `{ selector: "host" }` (for keyword abilities granted by gear). Default: self. */
  host?: boolean;
}

/**
 * Canonical reminder text for each keyword. Card files whose printed reminder
 * differs pass an explicit `{ text }` override to the factory so the on-card
 * copy is preserved verbatim.
 */
const DEFAULT_TEXT: Record<CardKeyword, string> = {
  goSolo: "GO SOLO",
  blocker: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  adrenaline: "ADRENALINE (This Unit can attack the turn it's played.)",
  quick: "QUICK",
};

function buildKeywordAbility(keyword: CardKeyword, options?: KeywordAbilityOptions): Ability {
  const text = options?.text ?? DEFAULT_TEXT[keyword];
  const source: SelfTargetDSL | HostTargetDSL = options?.host
    ? { selector: "host" }
    : { selector: "self" };

  return {
    kind: "keyword",
    text,
    keyword,
    source,
    effects: [],
  };
}

/** Build a `goSolo` keyword ability (default source: self). */
export function goSoloAbility(options?: KeywordAbilityOptions): Ability {
  return buildKeywordAbility("goSolo", options);
}

/** Build a `blocker` keyword ability (default source: self). */
export function blockerAbility(options?: KeywordAbilityOptions): Ability {
  return buildKeywordAbility("blocker", options);
}

/** Build an `adrenaline` keyword ability (default source: self). */
export function adrenalineAbility(options?: KeywordAbilityOptions): Ability {
  return buildKeywordAbility("adrenaline", options);
}

/** Build a `quick` keyword ability (default source: self). */
export function quickAbility(options?: KeywordAbilityOptions): Ability {
  return buildKeywordAbility("quick", options);
}
