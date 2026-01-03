/**
 * Trigger Parser for v2 Parser
 *
 * Extracts trigger information (timing, event, conditions) from text.
 * Migrated from v1 parser.
 */

import type { Trigger } from "@tcg/lorcana-types";

/**
 * Parse trigger from text
 *
 * Extracts timing (when/whenever/at) and event information
 */
export function parseTrigger(text: string): Trigger | undefined {
  // Strip named ability prefix if present (e.g., "YOUR REWARD AWAITS Whenever X, do Y")
  // Also handle restriction prefixes: "NAME Once per turn, when X, do Y"
  // Pattern: ALL_CAPS_NAME followed by optional restriction prefix and trigger word
  // Allow common punctuation in names like "IT WORKS!", "FINE PRINT"
  const nameMatch = text.match(
    /^([A-Z][A-Z\s!?'-]+)\s+(?:Once per turn,\s*)?(?:During your turn,\s*)?(When|Whenever)/i,
  );
  let textToParse = text;
  if (nameMatch) {
    // Remove the name from the text for parsing
    textToParse = text.substring(nameMatch[1].length).trim();
  }

  // Strip restriction prefixes if present (for cases without names)
  // e.g., "Once per turn, when X" or "During your turn, when X"
  const restrictionMatch = textToParse.match(
    /^(?:Once per turn|During your turn),\s*/i,
  );
  if (restrictionMatch) {
    textToParse = textToParse.substring(restrictionMatch[0].length).trim();
  }

  // Determine timing
  let timing: "when" | "whenever" | "at";
  if (textToParse.match(/^When\b/i)) {
    timing = "when";
  } else if (textToParse.match(/^Whenever\b/i)) {
    timing = "whenever";
  } else if (textToParse.match(/^At the (?:start|end) of\b/i)) {
    timing = "at";
  } else if (textToParse.match(/^The first time\b/i)) {
    timing = "whenever"; // "The first time" is a variant of whenever with a restriction
  } else {
    return undefined;
  }

  // Parse "At" triggers (phase-based)
  if (timing === "at") {
    if (textToParse.match(/At the start of your turn/i)) {
      return {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      };
    }
    if (textToParse.match(/At the end of your turn/i)) {
      return {
        event: "end-turn",
        timing: "at",
        on: "YOU",
      };
    }
  }

  // Parse self-triggers (must come before generic patterns)
  if (textToParse.match(/\byou play this character\b/i)) {
    return {
      event: "play",
      timing,
      on: "SELF",
    };
  }

  if (textToParse.match(/\byou play this (?:item|location)\b/i)) {
    return {
      event: "play",
      timing,
      on: "SELF",
    };
  }

  if (textToParse.match(/\bthis character quests\b/i)) {
    return {
      event: "quest",
      timing,
      on: "SELF",
    };
  }

  if (textToParse.match(/\bthis character challenges\b/i)) {
    return {
      event: "challenge",
      timing,
      on: "SELF",
    };
  }

  if (textToParse.match(/\bthis character is challenged\b/i)) {
    return {
      event: "challenged",
      timing,
      on: "SELF",
    };
  }

  if (textToParse.match(/\bthis character is banished\b/i)) {
    return {
      event: "banish",
      timing,
      on: "SELF",
    };
  }

  if (textToParse.match(/\bthis character leaves play\b/i)) {
    return {
      event: "leave-play",
      timing,
      on: "SELF",
    };
  }

  if (textToParse.match(/\bthis character banishes another character\b/i)) {
    return {
      event: "banish",
      timing,
      on: "OPPONENT_CHARACTERS",
    };
  }

  // Parse "you play a card" (generic - any card type)
  if (textToParse.match(/\byou play a card\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "card" },
    };
  }

  // Parse "you play X" triggers with specific card types
  // Check for classification-based triggers first (more specific)
  if (textToParse.match(/\byou play a Hero character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "character", classification: "Hero" },
    };
  }

  if (textToParse.match(/\byou play a Villain character\b/i)) {
    return {
      event: "play",
      timing,
      on: {
        controller: "you",
        cardType: "character",
        classification: "Villain",
      },
    };
  }

  if (textToParse.match(/\byou play a Princess character\b/i)) {
    return {
      event: "play",
      timing,
      on: {
        controller: "you",
        cardType: "character",
        classification: "Princess",
      },
    };
  }

  if (textToParse.match(/\byou play a King character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "character", classification: "King" },
    };
  }

  if (textToParse.match(/\byou play a Queen character\b/i)) {
    return {
      event: "play",
      timing,
      on: {
        controller: "you",
        cardType: "character",
        classification: "Queen",
      },
    };
  }

  if (textToParse.match(/\byou play a Pirate character\b/i)) {
    return {
      event: "play",
      timing,
      on: {
        controller: "you",
        cardType: "character",
        classification: "Pirate",
      },
    };
  }

  if (textToParse.match(/\byou play a Floodborn character\b/i)) {
    return {
      event: "play",
      timing,
      on: {
        controller: "you",
        cardType: "character",
        classification: "Floodborn",
      },
    };
  }

  // Check for "here" suffix before generic pattern
  if (textToParse.match(/\byou play a character here\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "character", here: true } as any, // 'here' is a custom extension
    };
  }

  // Generic card type triggers (less specific)
  if (textToParse.match(/\byou play a character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "character" },
    };
  }

  if (textToParse.match(/\byou play an? item\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "item" },
    };
  }

  if (textToParse.match(/\byou play an? action\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "action" },
    };
  }

  if (textToParse.match(/\byou play a song\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "action" }, // "song" is mapped to "action"
    };
  }

  if (textToParse.match(/\byou play an? location\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "location" },
    };
  }

  // Parse opponent triggers
  if (textToParse.match(/\ban opponent plays a song\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "opponent", cardType: "action" }, // "song" is mapped to "action"
    };
  }

  if (textToParse.match(/\ban opponent plays a character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "opponent", cardType: "character" },
    };
  }

  if (textToParse.match(/\ban opponent plays a card\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "opponent", cardType: "card" },
    };
  }

  // Parse "a character/item X" triggers (any player's)
  if (textToParse.match(/\ba character is banished\b/i)) {
    return {
      event: "banish",
      timing,
      on: "ANY_CHARACTER",
    };
  }

  if (textToParse.match(/\ban item is banished\b/i)) {
    return {
      event: "banish",
      timing,
      on: "YOUR_ITEMS",
    };
  }

  // Parse "your other characters" triggers
  if (textToParse.match(/\bone of your (?:other |.* )?characters/i)) {
    return {
      event: "banish", // Most common, could be other events
      timing,
      on: "YOUR_OTHER_CHARACTERS",
    };
  }

  // Default fallback - could not fully parse
  return undefined;
}
