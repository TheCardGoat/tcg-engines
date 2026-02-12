/**
 * Trigger Patterns for v2 Parser
 *
 * Patterns for detecting triggered ability timing words and common trigger events.
 * Migrated from v1 parser.
 */

/**
 * Pattern for "When" trigger timing
 */
export const WHEN_PATTERN = /^When\s+/;

/**
 * Pattern for "Whenever" trigger timing
 */
export const WHENEVER_PATTERN = /^Whenever\s+/;

/**
 * Pattern for "At the start of" trigger timing
 */
export const AT_START_PATTERN = /^At the start of\s+/;

/**
 * Pattern for "At the end of" trigger timing
 */
export const AT_END_PATTERN = /^At the end of\s+/;

/**
 * Pattern for "The first time" trigger timing
 */
export const FIRST_TIME_PATTERN = /^The first time\s+/;

/**
 * Pattern for "Once per turn, when/whenever" (restriction prefix)
 */
export const ONCE_PER_TURN_TRIGGER_PATTERN =
  /^Once per turn,\s+(?:when|whenever)\s+/i;

/**
 * Pattern for "During your turn, when" (restriction prefix)
 */
export const DURING_YOUR_TURN_TRIGGER_PATTERN =
  /^During your turn,\s+(?:when|whenever)\s+/i;

/**
 * Common trigger event patterns
 */
export const TRIGGER_EVENT_PATTERNS = {
  // Self triggers
  playSelf: /\byou play this character\b/i,
  playItemSelf: /\byou play this item\b/i,
  playLocationSelf: /\byou play this location\b/i,
  questSelf: /\bthis character quests\b/i,
  challengeSelf: /\bthis character challenges\b/i,
  challengedSelf: /\bthis character is challenged\b/i,
  banishSelf: /\bthis character is banished\b/i,
  banishInChallenge: /\bbanished in a challenge\b/i,

  // Generic "you play" triggers
  playCard: /\byou play a card\b/i,
  playCharacter: /\byou play a character\b/i,
  playSong: /\byou play a song\b/i,
  playAction: /\byou play an action\b/i,
  playItem: /\byou play an? item\b/i,
  playLocation: /\byou play an? location\b/i,
  playFloodborn: /\byou play a Floodborn character\b/i,

  // Classification-based triggers (Hero, Villain, etc.)
  playHeroCharacter: /\byou play a Hero character\b/i,
  playVillainCharacter: /\byou play a Villain character\b/i,
  playPrincessCharacter: /\byou play a Princess character\b/i,
  playKingCharacter: /\byou play a King character\b/i,
  playQueenCharacter: /\byou play a Queen character\b/i,
  playPirateCharacter: /\byou play a Pirate character\b/i,

  // Opponent triggers
  opponentPlaysSong: /\ban opponent plays a song\b/i,
  opponentPlaysCharacter: /\ban opponent plays a character\b/i,
  opponentPlaysCard: /\ban opponent plays a card\b/i,

  // Turn phase triggers
  startTurn: /\bstart of your turn\b/i,
  endTurn: /\bend of your turn\b/i,
} as const;

/**
 * Combined trigger patterns export
 */
export const TRIGGER_PATTERNS = {
  atEnd: AT_END_PATTERN,
  atStart: AT_START_PATTERN,
  duringYourTurnTrigger: DURING_YOUR_TURN_TRIGGER_PATTERN,
  events: TRIGGER_EVENT_PATTERNS,
  firstTime: FIRST_TIME_PATTERN,
  oncePerTurnTrigger: ONCE_PER_TURN_TRIGGER_PATTERN,
  when: WHEN_PATTERN,
  whenever: WHENEVER_PATTERN,
} as const;

/**
 * Check if text starts with a trigger word
 * Also checks for trigger words after restriction prefixes like "Once per turn" or "During your turn"
 */
export function isTriggeredAbilityText(text: string): boolean {
  // Direct trigger word at start
  if (
    WHEN_PATTERN.test(text) ||
    WHENEVER_PATTERN.test(text) ||
    AT_START_PATTERN.test(text) ||
    AT_END_PATTERN.test(text) ||
    FIRST_TIME_PATTERN.test(text)
  ) {
    return true;
  }

  // Trigger word after restriction prefix
  if (
    ONCE_PER_TURN_TRIGGER_PATTERN.test(text) ||
    DURING_YOUR_TURN_TRIGGER_PATTERN.test(text)
  ) {
    return true;
  }

  return false;
}
