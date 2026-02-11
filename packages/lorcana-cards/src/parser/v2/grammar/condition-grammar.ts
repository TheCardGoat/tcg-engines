/**
 * Condition Grammar Rules
 * Defines grammar rules for parsing condition phrases in Lorcana abilities.
 * Examples: "if you have X", "when X", "during your turn", "with X", "without X"
 */

import type { CstParser } from "chevrotain";
import {
  At,
  Character,
  During,
  Identifier,
  If,
  NumberToken,
  Your,
} from "../lexer/tokens";

/**
 * Adds condition-related grammar rules to the parser.
 * This function is called from the main parser class to mix in condition rules.
 * Note: Uses biome-ignore for the any cast - Chevrotain mixin pattern requires
 * accessing protected parser methods which TypeScript cannot type properly.
 */
export function addConditionRules(parser: CstParser): void {
  // Biome-ignore lint/suspicious/noExplicitAny: Chevrotain mixin requires accessing protected methods
  const p = parser as any;

  /**
   * Condition clause: Describes when/under what circumstances an effect applies.
   * Examples:
   * - "if you have another character"
   * - "during your turn"
   * - "at the start of your turn"
   * - "with X lore"
   * - "without abilities"
   */
  p.RULE("conditionClause", () => {
    p.OR([
      { ALT: () => p.SUBRULE(p.ifCondition) },
      { ALT: () => p.SUBRULE(p.duringCondition) },
      { ALT: () => p.SUBRULE(p.atCondition) },
      { ALT: () => p.SUBRULE(p.withCondition) },
      { ALT: () => p.SUBRULE(p.withoutCondition) },
    ]);
  });

  /**
   * If condition: "if <condition>"
   * Example: "if you have another character"
   */
  p.RULE("ifCondition", () => {
    p.CONSUME(If);
    p.SUBRULE(p.conditionExpression);
  });

  /**
   * During condition: "during <phase/turn>"
   * Example: "during your turn"
   */
  p.RULE("duringCondition", () => {
    p.CONSUME(During);
    p.OPTION(() => {
      p.CONSUME(Your);
    });
    p.CONSUME(Identifier); // "turn", "phase", etc.
  });

  /**
   * At condition: "at <timing>"
   * Example: "at the start of your turn"
   */
  p.RULE("atCondition", () => {
    p.CONSUME(At);
    p.MANY(() => {
      p.CONSUME(Identifier); // "the", "start", "of", etc.
    });
  });

  /**
   * With condition: "with <qualifier>"
   * Example: "with 5 or more lore"
   */
  p.RULE("withCondition", () => {
    p.CONSUME(Identifier); // "with"
    p.SUBRULE(p.conditionExpression);
  });

  /**
   * Without condition: "without <qualifier>"
   * Example: "without abilities"
   */
  p.RULE("withoutCondition", () => {
    p.CONSUME(Identifier); // "without"
    p.SUBRULE(p.conditionExpression);
  });

  /**
   * Condition expression: The actual condition being checked.
   * Examples:
   * - "you have another character"
   * - "5 or more lore"
   * - "at least 3 cards in hand"
   */
  p.RULE("conditionExpression", () => {
    // Flexible expression - consume tokens until we hit a terminator
    p.MANY(() => {
      p.OR([
        { ALT: () => p.CONSUME(Identifier) },
        { ALT: () => p.CONSUME(NumberToken) },
        { ALT: () => p.CONSUME(Character) },
        { ALT: () => p.CONSUME(Your) },
        // Add more token types as needed
      ]);
    });
  });
}
