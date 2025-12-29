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
 */
export function addTargetRules(parser: CstParser): void {
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
  parser.RULE("targetClause", () => {
    // Optional target modifier (your, opponent's, each, all, another, other)
    parser.OPTION(() => {
      parser.SUBRULE(parser.targetModifier);
    });

    // Target type (character, item, location, card, player)
    parser.SUBRULE(parser.targetType);
  });

  /**
   * Target modifier: Specifies whose/which targets are affected.
   * Examples: "your", "opponent's", "each", "all", "another", "other", "chosen", "this"
   */
  parser.RULE("targetModifier", () => {
    parser.OR([
      { ALT: () => parser.CONSUME(Your) },
      { ALT: () => parser.CONSUME(Opponent) },
      { ALT: () => parser.CONSUME(Each) },
      { ALT: () => parser.CONSUME(All) },
      { ALT: () => parser.CONSUME(Another) },
      { ALT: () => parser.CONSUME(Other) },
      { ALT: () => parser.CONSUME(Chosen) },
      { ALT: () => parser.CONSUME(This) },
    ]);

    // Handle possessive "'s" for opponent's
    parser.OPTION(() => {
      parser.CONSUME(Identifier); // catches "'s" or "s"
    });
  });

  /**
   * Target type: The type of game object being targeted.
   * Examples: character, item, location, card, player
   */
  parser.RULE("targetType", () => {
    parser.OR([
      { ALT: () => parser.CONSUME(Character) },
      { ALT: () => parser.CONSUME(Item) },
      { ALT: () => parser.CONSUME(Location) },
      { ALT: () => parser.CONSUME(Cards) },
      { ALT: () => parser.CONSUME(Card) },
      { ALT: () => parser.CONSUME(Identifier) }, // For "player" or other types
    ]);
  });
}
