/**
 * This file maps raw card ability texts to their corresponding ability types.
 * This mapping helps parse and categorize card text into programmatic ability types.
 */

import type { AbilityType } from "../abilities/ability-types";

export interface AbilityMapping {
  text: string;
  abilityType: AbilityType;
  description?: string;
}

export const abilityTypeMapping: AbilityMapping[] = [
  // Activated abilities
  {
    text: "{E} – Chosen character gets +3 {S} this turn.",
    abilityType: "activated",
    description: "Has exert cost and immediate effect",
  },
  {
    text: "{E} – Deal 1 damage to chosen character.",
    abilityType: "activated",
    description: "Has exert cost and immediate effect",
  },
  {
    text: "{E}, 1 {I} – Chosen character gains Challenger +2 this turn.",
    abilityType: "activated",
    description: "Has exert and ink cost with immediate effect",
  },
  {
    text: "{E}, Banish one of your items – Draw a card.",
    abilityType: "activated",
    description: "Has complex cost (exert and sacrifice) with immediate effect",
  },
  {
    text: "{E}, Choose and discard a card - Ready this character. He can't quest for the rest of this turn.",
    abilityType: "activated",
    description: "Has complex cost (exert and discard) with immediate effect",
  },

  // Triggered abilities
  {
    text: "When you play this character, gain 1 lore.",
    abilityType: "triggered",
    description: "Triggers on a specific event (playing the character)",
  },
  {
    text: "Whenever this character quests, chosen opposing character gets -2 {S} until the start of your next turn.",
    abilityType: "triggered",
    description: "Triggers every time a specific event occurs (questing)",
  },
  {
    text: "Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
    abilityType: "triggered",
    description: "Triggers on specific event with condition",
  },
  {
    text: "At the start of your turn, if this character has no damage, draw a card.",
    abilityType: "triggered",
    description: "Triggers at a specific game phase with condition",
  },
  {
    text: "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
    abilityType: "triggered",
    description: "Triggers at a specific game phase with negative condition",
  },

  // Static abilities
  {
    text: "This character gets +1 {S} for each other character you have in play.",
    abilityType: "static",
    description: "Continuously applied effect based on game state",
  },
  {
    text: "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    abilityType: "static",
    description: "Conditional continuous effect",
  },
  {
    text: "This character can challenge ready characters.",
    abilityType: "static",
    description: "Continuous rule modification",
  },
  {
    text: "This character can't be challenged.",
    abilityType: "static",
    description: "Continuous rule modification",
  },
  {
    text: "While this character has no damage, he gets +2 {S} and gains Support.",
    abilityType: "static",
    description: "Conditional continuous effect with multiple benefits",
  },

  // Keyword abilities
  {
    text: "Challenger +2",
    abilityType: "keyword",
    description: "Named ability with numeric value",
  },
  {
    text: "Resist +1",
    abilityType: "keyword",
    description: "Named ability with numeric value",
  },
  {
    text: "Rush",
    abilityType: "keyword",
    description: "Named ability",
  },
  {
    text: "Evasive",
    abilityType: "keyword",
    description: "Named ability",
  },
  {
    text: "Bodyguard",
    abilityType: "keyword",
    description: "Named ability",
  },
  {
    text: "Shift 3",
    abilityType: "keyword",
    description: "Named ability with numeric value",
  },

  // Replacement effects
  {
    text: "If an effect would cause you to discard one or more cards, you don't discard.",
    abilityType: "replacement",
    description: "Replaces one effect (discard) with another (no discard)",
  },
  {
    text: "Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
    abilityType: "replacement",
    description: "Replaces damage targeting with redirection",
  },
  {
    text: "If you used Shift to play this character, remove all damage from him.",
    abilityType: "replacement",
    description:
      "Conditionally replaces normal entrance with modified entrance",
  },
  {
    text: "If an effect would cause you to discard one or more cards from your hand during an opponent's turn, you don't discard.",
    abilityType: "replacement",
    description: "Conditionally replaces discard with no discard",
  },
];

/**
 * Splits the text into individual ability parts, for cards with multiple abilities.
 *
 * @param text The card text that may contain multiple abilities
 * @returns An array of individual ability texts
 */
export function splitAbilityText(text: string): string[] {
  if (!text) return [];

  // Special case - if text has line breaks, it might have multiple abilities
  if (text.includes("\n")) {
    // Some keyword abilities may have explanations in parentheses after line breaks
    // or have named abilities followed by descriptions
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    // If we have named abilities (all caps followed by regular text), split them
    const namedAbilities: string[] = [];
    let currentAbility = "";

    for (const line of lines) {
      // If line is in ALL CAPS or starts with an all caps word, it might be a new named ability
      if (/^[A-Z\s]+[A-Z]/.test(line) || /^[A-Z]+\s/.test(line)) {
        if (currentAbility) {
          namedAbilities.push(currentAbility);
        }
        currentAbility = line;
      } else {
        currentAbility += " " + line;
      }
    }

    if (currentAbility) {
      namedAbilities.push(currentAbility);
    }

    // If we found named abilities, return those
    if (namedAbilities.length > 1) {
      return namedAbilities;
    }

    // Check if the first line is a keyword ability
    const keywords = [
      "Rush",
      "Evasive",
      "Bodyguard",
      "Ward",
      "Reckless",
      "Support",
      "Vanish",
      "Challenger",
      "Resist",
      "Singer",
      "Shift",
      "Universal Shift",
      "Puppy Shift",
    ];

    if (
      lines.length > 1 &&
      keywords.some(
        (kw) =>
          lines[0].trim() === kw ||
          lines[0].trim().startsWith(kw + " ") ||
          lines[0].trim().startsWith(kw + "+"),
      )
    ) {
      // First line is a keyword, rest is separate ability
      return [lines[0], lines.slice(1).join(" ")];
    }
  }

  // For abilities with choices, we'll keep them as single ability
  if (text.includes("Choose one:") || text.includes("choose one:")) {
    return [text];
  }

  return [text];
}

// Helper function to detect ability type from text
export function detectAbilityType(cardText: string): AbilityType | null {
  if (!cardText) return null;

  // Clean up text for better matching
  const cleanText = cardText.trim();

  // First check if this is a complex text with multiple abilities
  const abilityParts = splitAbilityText(cleanText);

  // If we identified multiple abilities, analyze the first one
  // (main ability in most cases)
  if (abilityParts.length > 1) {
    // If the first part is very short, it's likely a keyword
    if (abilityParts[0].length < 20) {
      return detectSingleAbilityType(abilityParts[0]);
    }
  }

  return detectSingleAbilityType(cleanText);
}

// Helper to detect ability type from a single ability text
function detectSingleAbilityType(cardText: string): AbilityType | null {
  if (!cardText) return null;

  // Clean up text for better matching
  const cleanText = cardText.trim();

  // Handle named abilities (all caps label followed by ability text)
  if (/^[A-Z\s]+[A-Z]/.test(cleanText)) {
    const colonIndex = cleanText.indexOf(":");
    if (colonIndex !== -1) {
      // Process the part after the colon as the actual ability
      return detectSingleAbilityType(
        cleanText.substring(colonIndex + 1).trim(),
      );
    }

    // If text starts with all caps but doesn't have a colon,
    // check if the next word indicates a trigger
    const firstSpace = cleanText.indexOf(" ");
    if (firstSpace !== -1) {
      const afterNameText = cleanText.substring(firstSpace + 1).trim();
      if (
        afterNameText.startsWith("When") ||
        afterNameText.startsWith("Whenever") ||
        afterNameText.startsWith("At the")
      ) {
        return "triggered";
      }

      // Check if the remaining text indicates a static ability
      if (
        afterNameText.startsWith("While") ||
        afterNameText.startsWith("Your") ||
        afterNameText.startsWith("This character")
      ) {
        return "static";
      }

      // For other cases with all caps header, check the text after it
      return detectSingleAbilityType(afterNameText);
    }
  }

  // Check for activated abilities (typically have a cost followed by an effect)
  if (
    (cleanText.includes("{E}") ||
      cleanText.includes(" {I}") ||
      cleanText.includes("{e}")) &&
    (cleanText.includes("–") ||
      cleanText.includes("-") ||
      cleanText.includes("−"))
  ) {
    return "activated";
  }

  // Check for common activated ability patterns with named costs
  if (
    (cleanText.includes("Banish") &&
      (cleanText.includes("–") ||
        cleanText.includes("-") ||
        cleanText.includes("−"))) ||
    (cleanText.includes("Choose and discard") &&
      (cleanText.includes("–") ||
        cleanText.includes("-") ||
        cleanText.includes("−")))
  ) {
    return "activated";
  }

  // Check for triggered abilities
  if (
    cleanText.startsWith("When ") ||
    cleanText.startsWith("Whenever ") ||
    cleanText.startsWith("At the ") ||
    cleanText.startsWith("During ") ||
    cleanText.startsWith("Once during ") ||
    (cleanText.includes("when ") && !cleanText.startsWith("If "))
  ) {
    return "triggered";
  }

  // Check for replacement effects
  if (
    (cleanText.includes("would") && cleanText.includes("instead")) ||
    (cleanText.startsWith("If") && cleanText.includes("don't"))
  ) {
    return "replacement";
  }

  // Check for keywords (usually short, single words or phrases)
  const keywords = [
    "Rush",
    "Evasive",
    "Bodyguard",
    "Ward",
    "Reckless",
    "Support",
    "Vanish",
    "Challenger",
    "Resist",
    "Singer",
    "Shift",
    "Universal Shift",
    "Puppy Shift",
  ];

  if (
    keywords.some(
      (kw) =>
        cleanText === kw ||
        cleanText.startsWith(kw + " ") ||
        cleanText.startsWith(kw + "+") ||
        cleanText === kw.toLowerCase() ||
        cleanText === kw.toUpperCase(),
    )
  ) {
    return "keyword";
  }

  // Check for keyword abilities with descriptions in parentheses
  if (
    cleanText.includes("(") &&
    keywords.some(
      (kw) =>
        cleanText.startsWith(kw) || cleanText.toUpperCase().startsWith(kw),
    )
  ) {
    return "keyword";
  }

  // Check for static abilities (usually start with "This character", "Your", "While", or describe ongoing states)
  if (
    cleanText.startsWith("This character") ||
    cleanText.startsWith("Your ") ||
    cleanText.startsWith("While") ||
    cleanText.startsWith("Characters") ||
    cleanText.startsWith("Opposing") ||
    cleanText.startsWith("For each") ||
    cleanText.startsWith("If you have") ||
    cleanText.startsWith("You pay") ||
    cleanText.startsWith("You can't") ||
    (cleanText.includes("gain") &&
      !cleanText.includes("When") &&
      !cleanText.includes("Whenever"))
  ) {
    return "static";
  }

  // Generic static conditions
  const staticPatterns = [
    " gets +",
    " gains ",
    " can't ",
    " can ",
    " has ",
    " pay ",
    " enters play ",
    "You pay",
    "Players",
    "Each player",
    "Opponents",
    "Skip your",
  ];

  if (
    staticPatterns.some((pattern) => cleanText.includes(pattern)) &&
    !cleanText.startsWith("When") &&
    !cleanText.startsWith("Whenever") &&
    !cleanText.startsWith("At the")
  ) {
    return "static";
  }

  // Actions that don't have a clear trigger are typically triggered effects
  if (
    !(
      cleanText.includes("When") ||
      cleanText.includes("Whenever") ||
      cleanText.includes("At the")
    ) &&
    (cleanText.includes("Draw") ||
      cleanText.includes("Gain") ||
      cleanText.includes("Deal") ||
      cleanText.includes("Put") ||
      cleanText.includes("Return") ||
      cleanText.includes("Banish") ||
      cleanText.includes("Look at") ||
      cleanText.includes("Choose") ||
      cleanText.includes("Exert") ||
      cleanText.includes("Move"))
  ) {
    return "triggered"; // These are likely one-time triggered effects
  }

  // Choice lists are typically triggered
  if (
    cleanText.startsWith("Choose one:") ||
    cleanText.includes("choose one:")
  ) {
    return "triggered";
  }

  // If we can't determine the type, return null
  return null;
}
