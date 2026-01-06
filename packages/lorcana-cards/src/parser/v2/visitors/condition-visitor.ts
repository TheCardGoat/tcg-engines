/**
 * Condition Visitor
 * Transforms CST nodes for condition clauses into typed condition objects.
 */

import type { IfCondition } from "@tcg/lorcana-types/abilities";
import type { CstNode, IToken } from "chevrotain";
import { logger } from "../logging";

/**
 * Intermediate condition object representing when/under what circumstances an effect applies.
 * This is converted to full Condition types from @tcg/lorcana-types before use.
 */
export interface VisitorCondition {
  type: "if" | "during" | "at" | "with" | "without";
  expression: string;
}

/**
 * Parse condition clause from CST node.
 * Extracts condition type and expression from the CST context.
 */
export function parseConditionFromCst(ctx: {
  ifCondition?: CstNode[];
  duringCondition?: CstNode[];
  atCondition?: CstNode[];
  withCondition?: CstNode[];
  withoutCondition?: CstNode[];
  [key: string]: unknown;
}): VisitorCondition | null {
  logger.debug("Parsing condition from CST", { ctx });

  // Determine condition type
  // biome-ignore lint/suspicious/noExplicitAny: CST children type casting
  if (ctx.ifCondition) {
    return parseIfConditionFromCst(ctx.ifCondition[0].children as any);
  }
  if (ctx.duringCondition) {
    return parseDuringConditionFromCst(ctx.duringCondition[0].children as any);
  }
  if (ctx.atCondition) {
    return parseAtConditionFromCst(ctx.atCondition[0].children as any);
  }
  if (ctx.withCondition) {
    return parseWithConditionFromCst(ctx.withCondition[0].children as any);
  }
  if (ctx.withoutCondition) {
    return parseWithoutConditionFromCst(
      ctx.withoutCondition[0].children as any,
    );
  }

  logger.debug("No recognized condition type found in CST");
  return null;
}

/**
 * Parse "if" condition from CST node.
 */
function parseIfConditionFromCst(ctx: {
  conditionExpression?: CstNode[];
  [key: string]: unknown;
}): VisitorCondition | null {
  logger.debug("Parsing 'if' condition from CST", { ctx });

  const expression = extractExpressionFromCst(ctx.conditionExpression);

  if (!expression) {
    logger.warn("Failed to extract expression from 'if' condition");
    return null;
  }

  const condition: VisitorCondition = {
    type: "if",
    expression,
  };

  logger.info("Parsed 'if' condition from CST", { condition });
  return condition;
}

/**
 * Parse "during" condition from CST node.
 */
function parseDuringConditionFromCst(ctx: {
  Your?: IToken[];
  Identifier?: IToken[];
  [key: string]: unknown;
}): VisitorCondition | null {
  logger.debug("Parsing 'during' condition from CST", { ctx });

  const parts: string[] = [];

  if (ctx.Your) {
    parts.push("your");
  }

  if (ctx.Identifier) {
    parts.push(ctx.Identifier[0].image.toLowerCase());
  }

  const expression = parts.join(" ");

  if (!expression) {
    logger.warn("Failed to extract expression from 'during' condition");
    return null;
  }

  const condition: VisitorCondition = {
    type: "during",
    expression,
  };

  logger.info("Parsed 'during' condition from CST", { condition });
  return condition;
}

/**
 * Parse "at" condition from CST node.
 */
function parseAtConditionFromCst(ctx: {
  Identifier?: IToken[];
  [key: string]: unknown;
}): VisitorCondition | null {
  logger.debug("Parsing 'at' condition from CST", { ctx });

  if (!ctx.Identifier || ctx.Identifier.length === 0) {
    logger.warn("Failed to extract expression from 'at' condition");
    return null;
  }

  const expression = ctx.Identifier.map((token) => token.image)
    .join(" ")
    .toLowerCase();

  const condition: VisitorCondition = {
    type: "at",
    expression,
  };

  logger.info("Parsed 'at' condition from CST", { condition });
  return condition;
}

/**
 * Parse "with" condition from CST node.
 */
function parseWithConditionFromCst(ctx: {
  conditionExpression?: CstNode[];
  [key: string]: unknown;
}): VisitorCondition | null {
  logger.debug("Parsing 'with' condition from CST", { ctx });

  const expression = extractExpressionFromCst(ctx.conditionExpression);

  if (!expression) {
    logger.warn("Failed to extract expression from 'with' condition");
    return null;
  }

  const condition: VisitorCondition = {
    type: "with",
    expression,
  };

  logger.info("Parsed 'with' condition from CST", { condition });
  return condition;
}

/**
 * Parse "without" condition from CST node.
 */
function parseWithoutConditionFromCst(ctx: {
  conditionExpression?: CstNode[];
  [key: string]: unknown;
}): VisitorCondition | null {
  logger.debug("Parsing 'without' condition from CST", { ctx });

  const expression = extractExpressionFromCst(ctx.conditionExpression);

  if (!expression) {
    logger.warn("Failed to extract expression from 'without' condition");
    return null;
  }

  const condition: VisitorCondition = {
    type: "without",
    expression,
  };

  logger.info("Parsed 'without' condition from CST", { condition });
  return condition;
}

/**
 * Extract expression text from condition expression CST node.
 */
function extractExpressionFromCst(
  expressionNodes: CstNode[] | undefined,
): string | null {
  if (!expressionNodes || expressionNodes.length === 0) {
    return null;
  }

  // biome-ignore lint/suspicious/noExplicitAny: CST children type casting
  const ctx = expressionNodes[0].children as any as {
    Identifier?: IToken[];
    NumberToken?: IToken[];
    Character?: IToken[];
    Your?: IToken[];
    [key: string]: unknown;
  };

  const tokens: IToken[] = [];

  // Collect all tokens in order
  if (ctx.Identifier) {
    tokens.push(...ctx.Identifier);
  }
  if (ctx.NumberToken) {
    tokens.push(...ctx.NumberToken);
  }
  if (ctx.Character) {
    tokens.push(...ctx.Character);
  }
  if (ctx.Your) {
    tokens.push(...ctx.Your);
  }

  // Sort by token position and join
  const sortedTokens = tokens.sort((a, b) => {
    if (a.startOffset === undefined || b.startOffset === undefined) {
      return 0;
    }
    return a.startOffset - b.startOffset;
  });

  const expression = sortedTokens
    .map((token) => token.image)
    .join(" ")
    .toLowerCase();

  return expression || null;
}

/**
 * Parse condition from text string (regex-based fallback).
 * Used when grammar-based parsing is not available.
 *
 * Returns VisitorCondition which can be converted to full Condition types.
 */
export function parseConditionFromText(text: string): VisitorCondition | null {
  logger.debug("Parsing condition from text", { text });

  // Common condition patterns
  const patterns: Array<{ regex: RegExp; type: VisitorCondition["type"] }> = [
    { regex: /\bif\s+(.+?)(?:,|$)/i, type: "if" },
    { regex: /\bduring\s+(.+?)(?:,|$)/i, type: "during" },
    { regex: /\bat\s+(.+?)(?:,|$)/i, type: "at" },
    { regex: /\bwith\s+(.+?)(?:,|$)/i, type: "with" },
    { regex: /\bwithout\s+(.+?)(?:,|$)/i, type: "without" },
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      const condition: VisitorCondition = {
        type: pattern.type,
        expression: match[1].trim(),
      };

      logger.info("Parsed condition from text", { condition });
      return condition;
    }
  }

  logger.debug("No condition pattern matched in text");
  return null;
}

/**
 * Convert VisitorCondition to full Condition type from @tcg/lorcana-types.
 * All variants are converted to IfCondition as the catch-all type.
 * The expression is preserved without adding the type prefix.
 */
export function toCondition(
  visitor: VisitorCondition | null,
): IfCondition | null {
  if (!visitor) return null;

  return {
    type: "if",
    expression: visitor.expression,
  };
}
