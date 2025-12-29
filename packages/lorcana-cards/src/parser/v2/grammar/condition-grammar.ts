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
 */
export function addConditionRules(parser: CstParser): void {
  /**
   * Condition clause: Describes when/under what circumstances an effect applies.
   * Examples:
   * - "if you have another character"
   * - "during your turn"
   * - "at the start of your turn"
   * - "with X lore"
   * - "without abilities"
   */
  parser.RULE("conditionClause", () => {
    parser.OR([
      { ALT: () => parser.SUBRULE(parser.ifCondition) },
      { ALT: () => parser.SUBRULE(parser.duringCondition) },
      { ALT: () => parser.SUBRULE(parser.atCondition) },
      { ALT: () => parser.SUBRULE(parser.withCondition) },
      { ALT: () => parser.SUBRULE(parser.withoutCondition) },
    ]);
  });

  /**
   * If condition: "if <condition>"
   * Example: "if you have another character"
   */
  parser.RULE("ifCondition", () => {
    parser.CONSUME(If);
    parser.SUBRULE(parser.conditionExpression);
  });

  /**
   * During condition: "during <phase/turn>"
   * Example: "during your turn"
   */
  parser.RULE("duringCondition", () => {
    parser.CONSUME(During);
    parser.OPTION(() => {
      parser.CONSUME(Your);
    });
    parser.CONSUME(Identifier); // "turn", "phase", etc.
  });

  /**
   * At condition: "at <timing>"
   * Example: "at the start of your turn"
   */
  parser.RULE("atCondition", () => {
    parser.CONSUME(At);
    parser.MANY(() => {
      parser.CONSUME(Identifier); // "the", "start", "of", etc.
    });
  });

  /**
   * With condition: "with <qualifier>"
   * Example: "with 5 or more lore"
   */
  parser.RULE("withCondition", () => {
    parser.CONSUME(Identifier); // "with"
    parser.SUBRULE(parser.conditionExpression);
  });

  /**
   * Without condition: "without <qualifier>"
   * Example: "without abilities"
   */
  parser.RULE("withoutCondition", () => {
    parser.CONSUME(Identifier); // "without"
    parser.SUBRULE(parser.conditionExpression);
  });

  /**
   * Condition expression: The actual condition being checked.
   * Examples:
   * - "you have another character"
   * - "5 or more lore"
   * - "at least 3 cards in hand"
   */
  parser.RULE("conditionExpression", () => {
    // Flexible expression - consume tokens until we hit a terminator
    parser.MANY(() => {
      parser.OR([
        { ALT: () => parser.CONSUME(Identifier) },
        { ALT: () => parser.CONSUME(NumberToken) },
        { ALT: () => parser.CONSUME(Character) },
        { ALT: () => parser.CONSUME(Your) },
        // Add more token types as needed
      ]);
    });
  });
}
