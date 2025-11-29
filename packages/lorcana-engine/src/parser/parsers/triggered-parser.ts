/**
 * Triggered Ability Parser
 *
 * Parses triggered abilities from text.
 * Format: "{Trigger}, {Effect}" or "NAME {Trigger}, {Effect}"
 * Examples:
 * - "When you play this character, draw a card"
 * - "Whenever this character quests, gain 1 lore"
 * - "DARK KNOWLEDGE Whenever this character quests, you may draw a card"
 */

import type { TriggeredAbility } from "../../cards/abilities/types/ability-types";
import type {
  Trigger,
  TriggerTiming,
} from "../../cards/abilities/types/trigger-types";
import { extractNamedAbilityPrefix } from "../preprocessor";
import type { ParseResult } from "../types";
import { extractConditionText, parseCondition } from "./condition-parser";
import { parseEffect } from "./effect-parser";

/**
 * Parse a triggered ability from text
 *
 * @param text - Normalized ability text
 * @returns Parse result with triggered ability
 */
export function parseTriggeredAbility(text: string): ParseResult {
  // Extract named ability prefix if present
  const extracted = extractNamedAbilityPrefix(text);
  const name = extracted?.name;
  const remainingText = extracted?.remainingText || text;

  // Extract trigger timing and event
  const trigger = parseTrigger(remainingText);
  if (!trigger) {
    return {
      success: false,
      error: "Could not parse trigger from text",
    };
  }

  // Split trigger from effect (look for comma after trigger phrase)
  const triggerMatch = remainingText.match(
    /^(When|Whenever|At the (?:start|end) of|The first time) (.+?),\s*(.+)$/i,
  );
  if (!triggerMatch) {
    return {
      success: false,
      error: "Could not split trigger from effect",
    };
  }

  const effectText = triggerMatch[3];

  // Extract condition if present ("if X" or "while X")
  const conditionText = extractConditionText(effectText);
  const condition = conditionText ? parseCondition(conditionText) : undefined;

  // Remove condition from effect text
  const cleanEffectText = conditionText
    ? effectText.replace(
        new RegExp(`,?\\s*(?:if|while)\\s+${conditionText}`, "i"),
        "",
      )
    : effectText;

  // Parse effect
  const effect = parseEffect(cleanEffectText);
  if (!effect) {
    return {
      success: false,
      error: `Could not parse effect: "${cleanEffectText}"`,
    };
  }

  // Build triggered ability
  const ability: TriggeredAbility = {
    type: "triggered",
    trigger,
    effect,
  };

  if (name) {
    ability.name = name;
  }

  if (condition) {
    ability.condition = condition;
  }

  return {
    success: true,
    ability: {
      ability,
      text,
      name,
    },
  };
}

/**
 * Parse trigger from text
 *
 * Extracts timing (when/whenever/at) and event information
 */
function parseTrigger(text: string): Trigger | undefined {
  // Determine timing
  let timing: TriggerTiming;
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

  // Parse event-based triggers for characters
  if (text.match(/\byou play this character\b/i)) {
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

  // Parse "you play X" triggers
  if (text.match(/\byou play this (?:item|location)\b/i)) {
    return {
      event: "play",
      timing,
      on: "SELF",
    };
  }

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
  if (text.match(/\bone of your (?:other )?characters/i)) {
    return {
      event: "banish", // Most common, could be other events
      timing,
      on: "YOUR_OTHER_CHARACTERS",
    };
  }

  // Default fallback - could not fully parse
  return undefined;
}
