/**
 * Effect Pattern Definitions
 *
 * Regex patterns for parsing Riftbound effect text.
 */

// ============================================================================
// Movement Effect Patterns
// ============================================================================

/**
 * Pattern to match recall effects: "Recall me/a unit [exhausted]."
 *
 * Captures:
 * - Group 1: Target ("me", "a unit", "that unit", etc.)
 * - Group 2: "exhausted" modifier (optional)
 *
 * @example "Recall me." -> ["me", undefined]
 * @example "Recall me exhausted." -> ["me", "exhausted"]
 * @example "Recall a unit." -> ["a unit", undefined]
 * @example "Recall that unit exhausted." -> ["that unit", "exhausted"]
 */
export const RECALL_PATTERN =
  /^Recall (me|a unit|that unit|an? (?:friendly |enemy )?unit)(?:\s+(exhausted))?\.?$/i;

/**
 * Pattern to match basic move effects: "Move a/an [controller] unit(s) [to location]."
 *
 * Captures:
 * - Group 1: Quantity ("a", "an", "up to N")
 * - Group 2: Controller ("friendly ", "enemy ", or empty)
 * - Group 3: Target type ("unit", "units")
 * - Group 4: Destination ("to base", "to here", etc.) - optional
 *
 * @example "Move a friendly unit." -> ["a", "friendly ", "unit", undefined]
 * @example "Move an enemy unit to here." -> ["an", "enemy ", "unit", "to here"]
 * @example "Move up to 2 friendly units to base." -> ["up to 2", "friendly ", "units", "to base"]
 */
export const MOVE_BASIC_PATTERN =
  /^Move (a|an|up to \d+) (friendly |enemy )?(units?)(?:\s+(to (?:base|here|its base|a battlefield|battlefield)))?(?: and ready it)?\.?$/i;

/**
 * Pattern to match move effects with from/to locations:
 * "Move a unit from [location] to [location]."
 *
 * Captures:
 * - Group 1: Quantity ("a", "an")
 * - Group 2: Target type ("unit", "units")
 * - Group 3: From location
 * - Group 4: To location
 *
 * @example "Move a unit from a battlefield to its base." -> ["a", "unit", "a battlefield", "its base"]
 */
export const MOVE_FROM_TO_PATTERN =
  /^Move (a|an) (units?) from (a battlefield|battlefield|base|here) to (its base|base|here|a battlefield|battlefield)\.?$/i;

// ============================================================================
// Stat Modification Effect Patterns
// ============================================================================

/**
 * Pattern to match modify-might effects: "Give TARGET +/-N :rb_might: this turn."
 *
 * Captures:
 * - Group 1: Target ("a unit", "friendly units", etc.)
 * - Group 2: Sign and amount ("+5", "-4")
 * - Group 3: Duration ("this turn") - optional
 * - Group 4: Minimum clause ("to a minimum of 1 :rb_might:") - optional
 *
 * @example "Give a unit +5 :rb_might: this turn." -> ["a unit", "+5", "this turn", undefined]
 * @example "Give a unit -4 :rb_might: this turn, to a minimum of 1 :rb_might:." -> ["a unit", "-4", "this turn", "to a minimum of 1 :rb_might:"]
 */
export const MODIFY_MIGHT_PATTERN =
  /^Give ((?:a|an|two|three|four|five|\d+)?\s*(?:friendly |enemy )?(?:unit|units)(?:\s+(?:at a battlefield|here|there))?)\s+([+-]\d+)\s*:rb_might:\s*(this turn)?(?:,?\s*(to a minimum of (\d+)\s*:rb_might:))?\.?$/i;

// ============================================================================
// Kill Effect Patterns
// ============================================================================

/**
 * Pattern to match kill effects: "Kill TARGET."
 *
 * Captures:
 * - Group 1: Target ("a unit", "all gear", "a unit at a battlefield", etc.)
 *
 * @example "Kill a unit at a battlefield." -> ["a unit at a battlefield"]
 * @example "Kill all gear." -> ["all gear"]
 */
export const KILL_PATTERN =
  /^Kill ((?:a|an|all)\s+(?:friendly |enemy )?(?:unit|units|gear)(?:\s+(?:at a battlefield|here|there))?)\.?$/i;

// ============================================================================
// Counter Effect Patterns
// ============================================================================

/**
 * Pattern to match counter effects: "Counter a spell."
 *
 * Captures:
 * - Group 1: Target ("a spell", "an enemy spell", etc.)
 *
 * @example "Counter a spell." -> ["a spell"]
 */
export const COUNTER_PATTERN = /^Counter (a spell|an? .+spell.*)\.?$/i;

// ============================================================================
// Stun Effect Patterns
// ============================================================================

/**
 * Pattern to match stun effects: "Stun TARGET."
 *
 * Captures:
 * - Group 1: Target ("a unit", "an enemy unit", etc.)
 *
 * @example "Stun a unit." -> ["a unit"]
 * @example "Stun an enemy unit at a battlefield." -> ["an enemy unit at a battlefield"]
 */
export const STUN_PATTERN =
  /^Stun ((?:a|an)\s+(?:friendly |enemy )?unit(?:\s+(?:at a battlefield|here|there))?)\.?$/i;

// ============================================================================
// Return to Hand Effect Patterns
// ============================================================================

/**
 * Pattern to match return-to-hand effects: "Return TARGET to owner's hand."
 *
 * Captures:
 * - Group 1: Target ("a gear", "a unit at a battlefield", etc.)
 * - Group 2: Owner ("its owner's", "your")
 *
 * @example "Return a gear to its owner's hand." -> ["a gear", "its owner's"]
 * @example "Return a unit from your trash to your hand." -> ["a unit from your trash", "your"]
 */
export const RETURN_TO_HAND_PATTERN =
  /^Return ((?:a|an)\s+(?:friendly |enemy )?(?:unit|gear)(?:\s+(?:at a battlefield|from your trash|here|there|with \d+ :rb_might: or less))?)\s+to\s+(its owner's|your)\s+hand\.?$/i;

// ============================================================================
// Token Creation Effect Patterns
// ============================================================================

/**
 * Pattern to match token creation effects: "Play N MIGHT TOKEN tokens."
 *
 * Captures:
 * - Group 1: Quantity ("four", "two", "1", etc.)
 * - Group 2: Might value
 * - Group 3: Token name ("Recruit", "Mech", etc.)
 * - Group 4: Token type ("unit", "gear")
 *
 * @example "Play four 1 :rb_might: Recruit unit tokens." -> ["four", "1", "Recruit", "unit"]
 */
export const CREATE_TOKEN_PATTERN =
  /^Play (one|two|three|four|five|six|\d+)\s+(\d+)\s*:rb_might:\s+(\w+)\s+(unit|gear)\s+tokens?\.?$/i;

// ============================================================================
// Look Effect Patterns
// ============================================================================

/**
 * Pattern to match look effects: "Look at the top N cards of your DECK."
 *
 * Captures:
 * - Group 1: Amount
 * - Group 2: Deck type ("Main Deck", "Rune Deck", etc.)
 *
 * @example "Look at the top 3 cards of your Main Deck." -> ["3", "Main Deck"]
 */
export const LOOK_PATTERN =
  /^Look at the top (\d+) cards? of your (Main Deck|Rune Deck|deck)\.?/i;

// ============================================================================
// Fight Effect Patterns
// ============================================================================

/**
 * Pattern to match fight effects: "They deal damage equal to their Mights to each other."
 *
 * @example "They deal damage equal to their Mights to each other."
 */
export const FIGHT_PATTERN =
  /deal damage equal to their Mights to each other\.?$/i;

// ============================================================================
// Prevent Damage Effect Patterns
// ============================================================================

/**
 * Pattern to match prevent damage effects: "Prevent all/the next damage."
 *
 * Captures:
 * - Group 1: Amount ("all", "the next")
 * - Group 2: Damage type ("spell and ability", "combat", etc.) - optional
 *
 * @example "Prevent all spell and ability damage this turn." -> ["all", "spell and ability"]
 */
export const PREVENT_DAMAGE_PATTERN =
  /^Prevent (all|the next)\s*(?:(\w+(?:\s+and\s+\w+)?)\s+)?damage/i;

// ============================================================================
// Gain Control of Spell Effect Patterns
// ============================================================================

/**
 * Pattern to match gain control of spell effects.
 *
 * Captures:
 * - Group 1: "You may make new choices for it" clause - optional
 *
 * @example "Gain control of a spell. You may make new choices for it."
 */
export const GAIN_CONTROL_OF_SPELL_PATTERN =
  /^Gain control of a spell\.?\s*(You may make new choices for it\.?)?$/i;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if text matches a recall pattern
 */
export function isRecallEffect(text: string): boolean {
  return RECALL_PATTERN.test(text);
}

/**
 * Check if text matches a move pattern
 */
export function isMoveEffect(text: string): boolean {
  return MOVE_BASIC_PATTERN.test(text) || MOVE_FROM_TO_PATTERN.test(text);
}

/**
 * Check if text matches a modify-might pattern
 */
export function isModifyMightEffect(text: string): boolean {
  return MODIFY_MIGHT_PATTERN.test(text);
}

/**
 * Check if text matches a kill pattern
 */
export function isKillEffect(text: string): boolean {
  return KILL_PATTERN.test(text);
}

/**
 * Check if text matches a counter pattern
 */
export function isCounterEffect(text: string): boolean {
  return COUNTER_PATTERN.test(text);
}

/**
 * Check if text matches a stun pattern
 */
export function isStunEffect(text: string): boolean {
  return STUN_PATTERN.test(text);
}

/**
 * Check if text matches a return-to-hand pattern
 */
export function isReturnToHandEffect(text: string): boolean {
  return RETURN_TO_HAND_PATTERN.test(text);
}

/**
 * Check if text matches a create-token pattern
 */
export function isCreateTokenEffect(text: string): boolean {
  return CREATE_TOKEN_PATTERN.test(text);
}

/**
 * Check if text matches a look pattern
 */
export function isLookEffect(text: string): boolean {
  return LOOK_PATTERN.test(text);
}

/**
 * Check if text matches a fight pattern
 */
export function isFightEffect(text: string): boolean {
  return FIGHT_PATTERN.test(text);
}

/**
 * Check if text matches a prevent-damage pattern
 */
export function isPreventDamageEffect(text: string): boolean {
  return PREVENT_DAMAGE_PATTERN.test(text);
}

/**
 * Check if text matches a gain-control-of-spell pattern
 */
export function isGainControlOfSpellEffect(text: string): boolean {
  return GAIN_CONTROL_OF_SPELL_PATTERN.test(text);
}

/**
 * Parse location string to Location type
 */
export function parseLocationString(
  locationStr: string,
): "base" | "battlefield" | "here" {
  const normalized = locationStr.toLowerCase().trim();

  if (
    normalized === "base" ||
    normalized === "its base" ||
    normalized === "to base" ||
    normalized === "to its base"
  ) {
    return "base";
  }
  if (normalized === "here" || normalized === "to here") {
    return "here";
  }
  if (
    normalized === "battlefield" ||
    normalized === "a battlefield" ||
    normalized === "to battlefield" ||
    normalized === "to a battlefield"
  ) {
    return "battlefield";
  }

  // Default to base for unrecognized locations
  return "base";
}
