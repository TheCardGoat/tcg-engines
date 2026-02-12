/**
 * Target Grammar Rules
 * Defines grammar rules for parsing target phrases in Lorcana abilities.
 * Examples: "chosen character", "another character", "all characters", "your characters"
 */

import type { CstParser } from "chevrotain";
import {
  All,
  Another,
  Card,
  Cards,
  Character,
  Chosen,
  Each,
  Identifier,
  Item,
  Location,
  Opponent,
  Other,
  This,
  Your,
} from "../lexer/tokens";

/**
 * Adds target-related grammar rules to the parser.
 * This function is called from the main parser class to mix in target rules.
 * Note: Uses biome-ignore for the any cast - Chevrotain mixin pattern requires
 * accessing protected parser methods which TypeScript cannot type properly.
 */
export function addTargetRules(parser: CstParser): void {
  // Biome-ignore lint/suspicious/noExplicitAny: Chevrotain mixin requires accessing protected methods
  const p = parser as any;

  /**
   * Target clause: Describes what/who is targeted by an effect.
   * Examples:
   * - "chosen character"
   * - "another character"
   * - "all characters"
   * - "your characters"
   * - "opponent's character"
   * - "each character"
   */
  p.RULE("targetClause", () => {
    // Optional target modifier (your, opponent's, each, all, another, other)
    p.OPTION(() => {
      p.SUBRULE(p.targetModifier);
    });

    // Target type (character, item, location, card, player)
    p.SUBRULE(p.targetType);
  });

  /**
   * Target modifier: Specifies whose/which targets are affected.
   * Examples: "your", "opponent's", "each", "all", "another", "other", "chosen", "this"
   */
  p.RULE("targetModifier", () => {
    p.OR([
      { ALT: () => p.CONSUME(Your) },
      { ALT: () => p.CONSUME(Opponent) },
      { ALT: () => p.CONSUME(Each) },
      { ALT: () => p.CONSUME(All) },
      { ALT: () => p.CONSUME(Another) },
      { ALT: () => p.CONSUME(Other) },
      { ALT: () => p.CONSUME(Chosen) },
      { ALT: () => p.CONSUME(This) },
    ]);

    // Handle possessive "'s" for opponent's
    p.OPTION(() => {
      p.CONSUME(Identifier); // Catches "'s" or "s"
    });
  });

  /**
   * Target type: The type of game object being targeted.
   * Examples: character, item, location, card, player
   */
  p.RULE("targetType", () => {
    p.OR([
      { ALT: () => p.CONSUME(Character) },
      { ALT: () => p.CONSUME(Item) },
      { ALT: () => p.CONSUME(Location) },
      { ALT: () => p.CONSUME(Cards) },
      { ALT: () => p.CONSUME(Card) },
      { ALT: () => p.CONSUME(Identifier) }, // For "player" or other types
    ]);
  });
}
