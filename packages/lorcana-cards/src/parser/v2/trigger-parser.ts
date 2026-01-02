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
  // Determine timing
  let timing: "when" | "whenever" | "at";
  if (text.match(/^When\b/i)) {
    timing = "when";
  } else if (text.match(/^Whenever\b/i)) {
    timing = "whenever";
  } else if (text.match(/^At the (?:start|end) of\b/i)) {
    timing = "at";
  } else if (text.match(/^The first time\b/i)) {
    timing = "whenever"; // "The first time" is a variant of whenever with a restriction
  } else {
    return undefined;
  }

  // Parse "At" triggers (phase-based)
  if (timing === "at") {
    if (text.match(/At the start of your turn/i)) {
      return {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      };
    }
    if (text.match(/At the end of your turn/i)) {
      return {
        event: "end-turn",
        timing: "at",
        on: "YOU",
      };
    }
  }

  // Parse self-triggers (must come before generic patterns)
  if (text.match(/\byou play this character\b/i)) {
    return {
      event: "play",
      timing,
      on: "SELF",
    };
  }

  if (text.match(/\byou play this (?:item|location)\b/i)) {
    return {
      event: "play",
      timing,
      on: "SELF",
    };
  }

  if (text.match(/\bthis character quests\b/i)) {
    return {
      event: "quest",
      timing,
      on: "SELF",
    };
  }

  if (text.match(/\bthis character challenges\b/i)) {
    return {
      event: "challenge",
      timing,
      on: "SELF",
    };
  }

  if (text.match(/\bthis character is challenged\b/i)) {
    return {
      event: "challenged",
      timing,
      on: "SELF",
    };
  }

  if (text.match(/\bthis character is banished\b/i)) {
    return {
      event: "banish",
      timing,
      on: "SELF",
    };
  }

  if (text.match(/\bthis character leaves play\b/i)) {
    return {
      event: "leave-play",
      timing,
      on: "SELF",
    };
  }

  if (text.match(/\bthis character banishes another character\b/i)) {
    return {
      event: "banish",
      timing,
      on: "OPPONENT_CHARACTERS",
    };
  }

  // Parse "you play a card" (generic - any card type)
  if (text.match(/\byou play a card\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "card" },
    };
  }

  // Parse "you play X" triggers with specific card types
  // Check for classification-based triggers first (more specific)
  if (text.match(/\byou play a Hero character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "character", classification: "Hero" },
    };
  }

  if (text.match(/\byou play a Villain character\b/i)) {
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

  if (text.match(/\byou play a Princess character\b/i)) {
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

  if (text.match(/\byou play a King character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "character", classification: "King" },
    };
  }

  if (text.match(/\byou play a Queen character\b/i)) {
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

  if (text.match(/\byou play a Pirate character\b/i)) {
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

  if (text.match(/\byou play a Floodborn character\b/i)) {
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

  // Generic card type triggers (less specific)
  if (text.match(/\byou play a character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "character" },
    };
  }

  if (text.match(/\byou play an? item\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "item" },
    };
  }

  if (text.match(/\byou play an? action\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "action" },
    };
  }

  if (text.match(/\byou play a song\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "song" },
    };
  }

  if (text.match(/\byou play an? location\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "you", cardType: "location" },
    };
  }

  // Parse opponent triggers
  if (text.match(/\ban opponent plays a song\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "opponent", cardType: "song" },
    };
  }

  if (text.match(/\ban opponent plays a character\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "opponent", cardType: "character" },
    };
  }

  if (text.match(/\ban opponent plays a card\b/i)) {
    return {
      event: "play",
      timing,
      on: { controller: "opponent", cardType: "card" },
    };
  }

  // Parse "a character/item X" triggers (any player's)
  if (text.match(/\ba character is banished\b/i)) {
    return {
      event: "banish",
      timing,
      on: "ANY_CHARACTER",
    };
  }

  if (text.match(/\ban item is banished\b/i)) {
    return {
      event: "banish",
      timing,
      on: "YOUR_ITEMS",
    };
  }

  // Parse "your other characters" triggers
  if (text.match(/\bone of your (?:other |.* )?characters/i)) {
    return {
      event: "banish", // Most common, could be other events
      timing,
      on: "YOUR_OTHER_CHARACTERS",
    };
  }

  // Default fallback - could not fully parse
  return undefined;
}
