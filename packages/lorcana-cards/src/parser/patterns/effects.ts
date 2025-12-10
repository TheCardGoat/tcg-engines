/**
 * Effect Patterns
 *
 * Regex patterns for matching effect phrases in ability text.
 * Covers common Lorcana effects:
 * - Draw/discard
 * - Damage
 * - Lore gain/loss
 * - Exert/ready
 * - Banish/return
 * - Stat modification
 * - Keyword granting
 * - Play card effects
 * - Reveal effects
 * - Search/look at cards effects
 * - Inkwell effects
 * - Location movement effects
 * - Composite effects (sequences, "and" combinations)
 * - Optional effects ("you may" and "if you do")
 * - For-each and repeat effects
 */

/**
 * Draw effect patterns
 * Now supports "Draw X cards", "Each player/opponent draws X cards", and "Chosen player draws X cards"
 * Updated to handle {d} placeholder
 */
export const DRAW_AMOUNT_PATTERN =
  /(?:[Ee]ach (?:player|opponent) |[Cc]hosen player )?[Dd]raw(?:s)? (?:an?|a|(\d+|\{d\})) cards?/;
export const CHOSEN_PLAYER_DRAWS_PATTERN =
  /[Cc]hosen player draws? (\d+|\{d\}) cards?/;

/**
 * Discard effect patterns
 * Now supports "Each player/opponent chooses and discards"
 */
export const DISCARD_PATTERN =
  /(?:[Ee]ach (?:player|opponent) )?[Dd]iscard(?:s)? (?:a|(\d+)|their hand) cards?/;
export const DISCARD_HAND_PATTERN =
  /(?:[Ee]ach (?:player|opponent) )?[Dd]iscard(?:s)? (?:their|your) hand/;
export const CHOOSE_AND_DISCARD_PATTERN =
  /(?:[Ee]ach (?:player|opponent) )?[Cc]hoose(?:s)? and discard(?:s)? (?:a|(\d+)) cards?/;

/**
 * Damage effect patterns
 * Updated to handle {d} placeholder
 */
export const DEAL_DAMAGE_PATTERN = /[Dd]eal (\d+|\{d\}) damage/;
export const REMOVE_DAMAGE_PATTERN =
  /[Rr]emove (?:up to )?(\d+|\{d\}) damage (?:from (?:chosen |one of your |each of your )?(?:(?:[A-Z][a-z]+) )?characters?|counters?)/;
export const PUT_DAMAGE_PATTERN = /[Pp]ut (\d+|\{d\}) damage counters?/;

/**
 * Lore effect patterns
 * Now supports "Each opponent loses X lore"
 * Updated to handle {d} placeholder
 */
export const GAIN_LORE_PATTERN = /[Gg]ain (\d+|\{d\}) lore/;
export const LOSE_LORE_PATTERN =
  /(?:[Ee]ach (?:player|opponent) )?[Ll]ose(?:s)? (\d+|\{d\}) lore/;

/**
 * Exert/ready effect patterns
 * Updated to support "Ready chosen X" where X can be character, item, or location
 */
export const EXERT_PATTERN =
  /[Ee]xert (?:up to \d+ )?(?:chosen )?(?:all )?(?:opposing )?(?:damaged )?(?:character|item|location)s?/;
export const READY_PATTERN =
  /[Rr]eady (?:chosen )?(?:this |your )?(?:other )?(?:exerted )?(?:[A-Z][a-z]+ )?(?:character|item|location|characters?)/;

/**
 * Banish effect patterns
 * Now supports "Banish all X" for items, characters, and locations
 */
export const BANISH_PATTERN =
  /[Bb]anish (?:chosen )?(?:opposing )?(?:damaged )?(?:all )?(?:the challenging |challenging |the challenged )?(?:(?:[A-Z][a-z]+) )?(?:character|item|location|her|him|it|them)s?/;
export const BANISH_ALL_PATTERN =
  /[Bb]anish all (?:opposing )?(?:character|item|location)s/;

/**
 * Return to hand effect patterns
 */
export const RETURN_TO_HAND_PATTERN =
  /[Rr]eturn (?:chosen )?(?:opposing )?(?:character|item|location|that card|this card) to (?:their|its|your) (?:player'?s? )?hand/;

/**
 * Return from discard effect patterns
 * Now supports returning any card type from discard to hand
 */
export const RETURN_FROM_DISCARD_PATTERN =
  /[Rr]eturn (?:a|an) (character|action|item|location|song)(?: card)?(?: named .*?)? from (?:your|their) discard (?:pile )?to (?:your|their) hand/;

/**
 * Stat modification patterns
 * Updated to handle {d} placeholder with optional +/- prefix
 * Supports "Chosen character gets +/-{d} {S/W/L} this turn"
 */
export const STAT_MODIFIER_PATTERN =
  /gets? ([+-]?\d+|[+-]?\{d\}) \{([SWL])\}(?: this turn)?/;

/**
 * Keyword grant patterns
 * Supports "Chosen character gains [Keyword] this turn"
 */
export const GRANT_KEYWORD_PATTERN =
  /gains? (Rush|Ward|Evasive|Bodyguard|Support|Reckless|Challenger \+\d+|Resist \+\d+)(?: this turn)?/;

/**
 * Look at cards patterns
 */
export const LOOK_AT_TOP_PATTERN =
  /[Ll]ook at the top (?:(\d+) cards?|card) of (?:your|their) deck/;
export const LOOK_AT_CARDS_FULL_PATTERN =
  /^[Ll]ook at the top (?:(\d+) cards?|card) of (?:your|their) deck(?:\.|,)?\s*(?:[Pp]ut (?:(\d+)|one) (?:of them )?(?:into your hand|on (?:the )?(?:top|bottom)))?$/;

/**
 * Look and put/move patterns
 */
export const PUT_ONE_ON_TOP_AND_BOTTOM_PATTERN =
  /[Pp]ut one on (?:the )?top(?: of (?:your )?deck)? and (?:the )?other on (?:the )?bottom/i;
export const PUT_ONE_IN_HAND_AND_BOTTOM_PATTERN =
  /[Pp]ut one into (?:your )?hand and (?:the )?other on (?:the )?bottom/i;
export const PUT_TOP_OR_BOTTOM_PATTERN =
  /[Pp]ut it on either (?:the )?top or (?:the )?bottom(?: of (?:your )?deck)?/i;
export const PUT_REST_ON_BOTTOM_PATTERN =
  /[Pp]ut the rest on (?:the )?bottom(?: of (?:your )?deck)?(?: in any order)?/i;
export const PUT_BACK_ON_TOP_PATTERN =
  /[Pp]ut them (?:back )?on (?:the )?top(?: of (?:your )?deck)?(?: in any order)?/i;
export const REVEAL_AND_PUT_IN_HAND_PATTERN =
  /[Rr]eveal (?:a|an) (.*?) and put it into (?:your )?hand/i;

/**
 * Search deck patterns
 */
export const SEARCH_DECK_PATTERN =
  /[Ss]earch your deck for (?:a |an )?(?:(character|action|item|location|song|floodborn)(?: card)?)?/;
export const SEARCH_DECK_PUT_PATTERN =
  /[Ss]earch your deck for (?:a |an )?(?:(character|action|item|location|song|floodborn)(?: card)?)?(?: and)? (?:put it (?:into your hand|on top|into play)|add it to your hand)/;
export const SEARCH_AND_SHUFFLE_PATTERN =
  /[Ss]earch your deck for (?:a |an )?(?:(character|action|item|location|song|floodborn)(?: card)?)?(?: and)? (?:put it (?:into your hand|on top|into play)|add it to your hand)(?:,)?(?: then)? shuffle/;

/**
 * Put into inkwell patterns
 */
export const PUT_INTO_INKWELL_PATTERN =
  /[Pp]ut (?:the top card of your deck|(?:an )?additional card from your hand|(?:any )?card from your hand|(?:chosen )?(?:character|item|location)|this card|that card)\s+into (?:your|their|their player'?s?) inkwell(?: facedown)?(?: and exerted)?(?: facedown)?/;
export const PUT_INTO_INKWELL_FACEDOWN_PATTERN =
  /[Pp]ut (?:the top card of your deck|(?:any )?card from your hand|(?:chosen )?(?:opposing )?(?:character|item|location)|this card|that card)\s+into (?:your|their|their player'?s?) inkwell (?:facedown|face ?down)(?: and exerted)?/;
export const YOU_MAY_PUT_INTO_INKWELL_PATTERN =
  /\byou may\b.*?\bput (?:a|an additional) card from your hand into your inkwell\b/i;

/**
 * Shuffle into deck patterns
 */
export const SHUFFLE_INTO_DECK_PATTERN =
  /[Ss]huffle (?:a card from any discard|(?:chosen )?(?:character|item|location)) into (?:their|its|your) (?:player'?s? )?deck/;

/**
 * Put under effect patterns (Boost mechanic)
 */
export const PUT_UNDER_PATTERN =
  /[Pp]ut (?:the top card of your deck|a card from your hand|(?:chosen )?(?:character|item)) under (?:this (?:character|location)|(?:chosen )?(?:character|location))/;

/**
 * Move to location patterns
 */
export const MOVE_TO_LOCATION_PATTERN =
  /[Mm]ove (?:a |one of your |chosen )?character(?:s)? (?:of yours )?to (?:this location|(?:a |chosen )?location)(?: for free)?/;

/**
 * Play card patterns
 */
export const PLAY_CARD_PATTERN =
  /[Pp]lay (?:a|an) (?:character|action|item|song) from your (?:discard|hand)(?: for free)?/;
export const PLAY_FROM_DISCARD_PATTERN =
  /[Pp]lay (?:a|an) (?:character|action|item|song) from your discard(?: for free)?/;
export const PLAY_COST_X_OR_LESS_FREE_PATTERN =
  /[Pp]lay (?:a|an) (?:character|action|item|song)(?: card)? with cost (\d+) or less for free/;
export const RETURN_COST_X_OR_LESS_PATTERN =
  /[Rr]eturn a (?:character|action|item|song) or (?:character|action|item|song) with cost (\d+) or less to (?:their|its|your) player'?s? hand/;

/**
 * Reveal patterns
 */
export const REVEAL_HAND_PATTERN = /[Rr]eveal(?:s)? (?:their|your) hand/;
export const REVEAL_TOP_CARD_PATTERN =
  /[Rr]eveal the top card of (?:your|their) deck/;

/**
 * Chosen patterns
 */
export const CHOSEN_OPPONENT_PATTERN = /[Cc]hosen opponent/;
export const CHOSEN_PLAYER_PATTERN = /[Cc]hosen player/;
export const CHOSEN_CHARACTER_PATTERN =
  /[Cc]hosen (?:opposing )?(?:damaged )?character/;
export const CHOSEN_ITEM_PATTERN = /[Cc]hosen (?:opposing )?item/;
export const CHOSEN_LOCATION_PATTERN = /[Cc]hosen (?:opposing )?location/;
export const CHOOSE_PATTERN =
  /[Cc]hoose (?:an? )?(?:opposing )?(?:character|item|location)/;

/**
 * Restriction patterns (for static abilities)
 */
export const CANT_BE_CHALLENGED_PATTERN = /[Cc]an'?t be challenged/;
export const CANT_CHALLENGE_PATTERN = /[Cc]an(?:'t|not) challenge/;
export const CANT_QUEST_PATTERN = /[Cc]an'?t quest/;
export const CANT_READY_PATTERN = /[Cc]an'?t ready|[Dd]oesn'?t ready/;
export const CANNOT_PATTERN = /[Cc]annot /;

/**
 * Enters play patterns
 */
export const ENTERS_PLAY_EXERTED_PATTERN = /[Ee]nters? play exerted/;

/**
 * Static grant patterns for "Your X gain/get Y"
 * These patterns match abilities that grant keywords or stat bonuses to groups of cards
 */
export const YOUR_CHARACTERS_GAIN_PATTERN =
  /[Yy]our (?:(?:[A-Z][a-z]+ )?)?characters? gains? ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s*\+\{d\}|\s*\+\d+)?)/;
export const YOUR_CHARACTERS_GET_STAT_PATTERN =
  /[Yy]our (?:(?:[A-Z][a-z]+ )?)?characters? gets? ([+-]?\d+|[+-]?\{d\}) \{([SWL])\}/;
export const YOUR_ITEMS_GAIN_PATTERN =
  /[Yy]our items? gains? ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s*\+\{d\}|\s*\+\d+)?)/;
export const YOUR_ITEMS_GET_STAT_PATTERN =
  /[Yy]our items? gets? ([+-]?\d+|[+-]?\{d\}) \{([SWL])\}/;

/**
 * Location static patterns "while here"
 * These patterns match abilities granted to characters at a location
 */
export const CHARACTERS_GAIN_WHILE_HERE_PATTERN =
  /[Cc]haracters? gains? ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s*\+\{d\}|\s*\+\d+)?) while here/;
export const CHARACTERS_GET_STAT_WHILE_HERE_PATTERN =
  /[Cc]haracters? gets? ([+-]?\d+|[+-]?\{d\}) \{([SWL])\} while here/;

/**
 * Special ability grant pattern for "can challenge ready characters"
 */
export const CAN_CHALLENGE_READY_PATTERN = /[Cc]an challenge ready characters?/;

/**
 * Cost reduction patterns
 * Supports "You pay X {I} less to play..."
 */
export const PAY_LESS_TO_PLAY_PATTERN =
  /[Yy]ou pay (\d+|\{d\})\s*\{I\} less (?:to play|for) (.*?)(?: this turn)?(?:\.)?$/;

/**
 * Self stat modification pattern
 * Supports "This character gets +X {S/W/L}..."
 */
export const THIS_CHARACTER_GETS_STAT_PATTERN =
  /[Tt]his character gets ([+-]?\d+|[+-]?\{d\}) \{([SWL])\}/;

/**
 * Singer restriction pattern
 */
export const CANT_SING_PATTERN = /[Cc]an'?t \{E\} to sing/;

/**
 * Optional effect patterns
 * Supports "you may" and "if you do" follow-up effects
 */
export const YOU_MAY_PATTERN = /\byou may\b/i;
export const IF_YOU_DO_PATTERN = /\.\s*if you do,?\s+/i;

/**
 * For-each effect patterns
 * Patterns for matching the counter portion AFTER "for each" has been split off
 * E.g., after splitting "Gain 1 lore for each character you have", these match "character you have"
 */
export const FOR_EACH_PATTERN = /\bfor each\b/i;
export const FOR_EACH_CHARACTER_PATTERN =
  /^(?:(your|opponent's) )?characters?(?: (?:you|they) have)?(?: in play)?$/i;
export const FOR_EACH_DAMAGED_CHARACTER_PATTERN =
  /^damaged characters?(?: in play)?$/i;
export const FOR_EACH_ITEM_PATTERN =
  /^(?:(your|opponent's) )?items?(?: (?:you|they) have)?(?: in play)?$/i;
export const FOR_EACH_LOCATION_PATTERN =
  /^(?:(your|opponent's) )?locations?(?: (?:you|they) have)?(?: in play)?$/i;
export const FOR_EACH_CARD_IN_HAND_PATTERN =
  /^card in (?:(your|their|opponent's) )?hand$/i;
export const FOR_EACH_CARD_IN_DISCARD_PATTERN =
  /^card in (?:(your|their|opponent's) )?discard(?: pile)?$/i;
export const FOR_EACH_DAMAGE_ON_SELF_PATTERN =
  /^damage (?:counter )?on (?:this (?:character|location)|it)$/i;
export const FOR_EACH_DAMAGE_ON_TARGET_PATTERN =
  /^damage (?:counter )?on (?:chosen )?(?:character|location)$/i;
export const FOR_EACH_CARD_UNDER_SELF_PATTERN =
  /^card under (?:this (?:character|location)|it)$/i;
export const FOR_EACH_CHARACTER_THAT_SANG_PATTERN =
  /^character that sang(?: this turn)?$/i;
export const FOR_EACH_DAMAGE_REMOVED_PATTERN =
  /^(?:(\d+) )?damage removed(?: this way)?$/i;
export const FOR_EACH_LORE_LOST_PATTERN =
  /^(?:(\d+) )?lore lost(?: this way)?$/i;

/**
 * Repeat effect patterns
 */
export const REPEAT_PATTERN = /[Rr]epeat (?:this|that) (\d+) times?/i;
export const REPEAT_UP_TO_PATTERN =
  /(?:[Yy]ou may )?[Rr]epeat (?:this|that) up to (\d+) times?/i;

/**
 * Sequence separator patterns (for composite effects)
 * Ordered from most specific to least specific
 */
export const THEN_SEPARATOR = /,\s+then\s+/i;
export const PERIOD_THEN_SEPARATOR = /\.\s+[Tt]hen,?\s+/;
export const PERIOD_SEPARATOR = /\.[,]?\s+/; // Period followed by space, optional comma for weird texts
export const AND_SEPARATOR =
  /\s+and\s+(?=\b(?:draw|gain|deal|exert|ready|banish|return)\b)/i; // "and" before effect verbs
export const COMMA_SEPARATOR = /,\s+(?!then|if)\b/i; // Comma not followed by then/if

/**
 * Choice patterns
 * Supports: "Choose one:", bullet separators "•", period separators, and "or" format
 */
export const CHOOSE_ONE_PATTERN = /[Cc]hoose one:/;
export const CHOICE_BULLET_SEPARATOR = /\s*•\s*/;
export const CHOICE_PERIOD_SEPARATOR = /\.\s+/;
export const CHOICE_OR_SEPARATOR = /\s+or\s+(?!(?:more|less|equal))/i; // "or" but not "or more"/"or less"

/**
 * Check if text contains an optional effect
 */
export function hasOptionalEffect(text: string): boolean {
  return YOU_MAY_PATTERN.test(text);
}

/**
 * Check if text contains "if you do" pattern
 */
export function hasIfYouDoPattern(text: string): boolean {
  return IF_YOU_DO_PATTERN.test(text);
}

/**
 * Split text on "if you do" separator
 * Returns [optional part, follow-up part] or undefined if no match
 */
export function splitOnIfYouDo(text: string): [string, string] | undefined {
  const match = text.match(IF_YOU_DO_PATTERN);
  if (!match) return undefined;

  const parts = text.split(IF_YOU_DO_PATTERN);
  if (parts.length !== 2) return undefined;

  return [parts[0].trim(), parts[1].trim()];
}

/**
 * Check if text contains a for-each effect
 */
export function hasForEachEffect(text: string): boolean {
  return FOR_EACH_PATTERN.test(text);
}

/**
 * Check if text contains a repeat effect
 */
export function hasRepeatEffect(text: string): boolean {
  return REPEAT_PATTERN.test(text) || REPEAT_UP_TO_PATTERN.test(text);
}

/**
 * Split text on "for each" separator
 * Returns [effect part, for-each part] or undefined if no match
 *
 * Example: "Gain 1 lore for each character you have" -> ["Gain 1 lore", "character you have"]
 */
export function splitOnForEach(text: string): [string, string] | undefined {
  const match = text.match(/(.+?)\s+for each\s+(.+)/i);
  if (!match) return undefined;

  return [match[1].trim(), match[2].trim()];
}

/**
 * Check if text contains a composite effect (sequence)
 * Tests for "then", period separators, or "and" between effects
 */
export function hasSequenceEffect(text: string): boolean {
  return (
    THEN_SEPARATOR.test(text) ||
    PERIOD_THEN_SEPARATOR.test(text) ||
    PERIOD_SEPARATOR.test(text) ||
    AND_SEPARATOR.test(text)
  );
}

/**
 * Check if text contains a choice effect
 * Checks for "Choose one:" prefix or "or" separator between effects
 */
export function hasChoiceEffect(text: string): boolean {
  if (CHOOSE_ONE_PATTERN.test(text)) {
    return true;
  }

  // Check for "or" format, but avoid "choose and discard or" pattern
  if (
    CHOICE_OR_SEPARATOR.test(text) &&
    !CHOOSE_AND_DISCARD_PATTERN.test(text)
  ) {
    // Additional validation: ensure it's between effect verbs
    const orSeparatorPattern =
      /\b(draw|gain|deal|exert|ready|banish|return)[^.]*\s+or\s+[^.]*\b(draw|gain|deal|exert|ready|banish|return)\b/i;
    return orSeparatorPattern.test(text);
  }

  return false;
}

/**
 * Split text into sequence steps based on separators
 * Returns array of effect texts in order
 *
 * @param text - Text containing composite effect
 * @returns Array of effect text strings
 */
export function splitSequenceSteps(text: string): string[] {
  let parts: string[] = [];

  // Try "then" separators first (highest priority)
  if (THEN_SEPARATOR.test(text)) {
    parts = text.split(THEN_SEPARATOR);
  } else if (PERIOD_THEN_SEPARATOR.test(text)) {
    parts = text.split(PERIOD_THEN_SEPARATOR);
  } else if (PERIOD_SEPARATOR.test(text)) {
    // Split on periods, but be careful with abbreviations
    parts = text.split(PERIOD_SEPARATOR);
  } else if (AND_SEPARATOR.test(text)) {
    // Split on "and" between effects
    parts = text.split(AND_SEPARATOR);
  } else if (COMMA_SEPARATOR.test(text)) {
    // Split on comma separator
    parts = text.split(COMMA_SEPARATOR);
  } else {
    // No separator found, return as single step
    return [text];
  }

  // Clean up parts: trim whitespace and remove empty strings
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
}

/**
 * Split choice effect text into options
 * Handles different choice formats:
 * - "Choose one: Draw a card. Deal 2 damage to chosen character."
 * - "Choose one: • Draw a card • Deal 2 damage to chosen character"
 * - "Draw a card or deal 2 damage to chosen character"
 *
 * @param text - Text containing choice effect
 * @returns Array of option text strings
 */
export function splitChoiceOptions(text: string): string[] {
  let optionsText = text;

  // Remove "Choose one:" prefix if present
  if (CHOOSE_ONE_PATTERN.test(text)) {
    optionsText = text.replace(CHOOSE_ONE_PATTERN, "").trim();
  }

  let parts: string[] = [];

  // Try bullet separator first (highest priority for explicit "Choose one:")
  if (CHOICE_BULLET_SEPARATOR.test(optionsText)) {
    parts = optionsText.split(CHOICE_BULLET_SEPARATOR);
  }
  // Try period separator (for "Choose one: X. Y. Z.")
  else if (
    CHOOSE_ONE_PATTERN.test(text) &&
    CHOICE_PERIOD_SEPARATOR.test(optionsText)
  ) {
    parts = optionsText.split(CHOICE_PERIOD_SEPARATOR);
  }
  // Try "or" separator (for "X or Y" format)
  else if (CHOICE_OR_SEPARATOR.test(optionsText)) {
    parts = optionsText.split(CHOICE_OR_SEPARATOR);
  }
  // No separator found, return as single option
  else {
    return [optionsText];
  }

  // Clean up parts: trim whitespace, remove empty strings, and remove trailing periods
  return parts
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter((part) => part.length > 0);
}
