/**
 * Trigger Patterns
 *
 * Patterns for detecting triggered ability timing words and common trigger events.
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
 * Common trigger event patterns
 */
export const TRIGGER_EVENT_PATTERNS = {
  playSelf: /\byou play this character\b/i,
  playCharacter: /\byou play a character\b/i,
  playSong: /\byou play a song\b/i,
  playFloodborn: /\byou play a Floodborn character\b/i,

  questSelf: /\bthis character quests\b/i,
  challengeSelf: /\bthis character challenges\b/i,
  challengedSelf: /\bthis character is challenged\b/i,

  banishSelf: /\bthis character is banished\b/i,
  banishInChallenge: /\bbanished in a challenge\b/i,

  startTurn: /\bstart of your turn\b/i,
  endTurn: /\bend of your turn\b/i,
} as const;

/**
 * Combined trigger patterns export
 */
export const TRIGGER_PATTERNS = {
  when: WHEN_PATTERN,
  whenever: WHENEVER_PATTERN,
  atStart: AT_START_PATTERN,
  atEnd: AT_END_PATTERN,
  firstTime: FIRST_TIME_PATTERN,
  events: TRIGGER_EVENT_PATTERNS,
} as const;

/**
 * Check if text starts with a trigger word
 */
export function isTriggeredAbilityText(text: string): boolean {
  return (
    WHEN_PATTERN.test(text) ||
    WHENEVER_PATTERN.test(text) ||
    AT_START_PATTERN.test(text) ||
    AT_END_PATTERN.test(text) ||
    FIRST_TIME_PATTERN.test(text)
  );
}
