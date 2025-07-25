/**
 * This file contains utility functions to analyze and categorize card text abilities.
 */

import type { AbilityType } from "../abilities/ability-types";
import { detectAbilityType } from "./ability-type-mapping";
import { cardTexts } from "./card-texts";

interface AbilityAnalysis {
  text: string;
  abilityType: AbilityType | null;
  patterns: {
    hasCost: boolean;
    hasImmediateEffect: boolean;
    hasTriggerCondition: boolean;
    hasKeyword: boolean;
    hasCondition: boolean;
    hasDuration: boolean;
    hasTarget: boolean;
  };
}

interface AbilityStatistics {
  total: number;
  byType: Record<AbilityType | "unknown", number>;
  patterns: Record<string, number>;
}

/**
 * Analyzes a card text and returns its ability type and pattern details
 */
export function analyzeCardText(text: string): AbilityAnalysis {
  const abilityType = detectAbilityType(text);

  // Identify various patterns in the text
  const hasCost =
    text.includes("{E}") ||
    text.includes("{I}") ||
    text.includes("Choose and discard") ||
    text.includes("Banish");

  const hasImmediateEffect =
    text.includes("Draw") ||
    text.includes("deal") ||
    text.includes("gain") ||
    text.includes("gets +") ||
    text.includes("gets -") ||
    text.includes("banish");

  const hasTriggerCondition =
    text.startsWith("When") ||
    text.startsWith("Whenever") ||
    text.startsWith("At the") ||
    text.startsWith("During");

  const hasKeyword = [
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
  ].some((kw) => text.includes(kw));

  const hasCondition =
    text.includes("if") ||
    text.includes("unless") ||
    text.includes("while") ||
    text.startsWith("If");

  const hasDuration =
    text.includes("this turn") ||
    text.includes("until") ||
    text.includes("for the rest of this turn") ||
    text.includes("next turn");

  const hasTarget =
    text.includes("chosen") ||
    text.includes("each") ||
    text.includes("all") ||
    text.includes("target");

  return {
    text,
    abilityType,
    patterns: {
      hasCost,
      hasImmediateEffect,
      hasTriggerCondition,
      hasKeyword,
      hasCondition,
      hasDuration,
      hasTarget,
    },
  };
}

/**
 * Analyzes a collection of card texts and returns statistics
 */
export function analyzeCardTextCollection(texts: string[]): AbilityStatistics {
  const results = texts.map(analyzeCardText);

  // Count by type
  const byType: Record<AbilityType | "unknown", number> = {
    activated: 0,
    triggered: 0,
    static: 0,
    keyword: 0,
    replacement: 0,
    unknown: 0,
  };

  results.forEach((result) => {
    if (result.abilityType) {
      byType[result.abilityType]++;
    } else {
      byType.unknown++;
    }
  });

  // Count pattern occurrences
  const patterns: Record<string, number> = {
    hasCost: 0,
    hasImmediateEffect: 0,
    hasTriggerCondition: 0,
    hasKeyword: 0,
    hasCondition: 0,
    hasDuration: 0,
    hasTarget: 0,
  };

  results.forEach((result) => {
    Object.entries(result.patterns).forEach(([pattern, hasPattern]) => {
      if (hasPattern) {
        patterns[pattern]++;
      }
    });
  });

  return {
    total: texts.length,
    byType,
    patterns,
  };
}

/**
 * Returns the analysis for all card texts
 */
export function getFullCardTextAnalysis(): AbilityStatistics {
  return analyzeCardTextCollection(cardTexts);
}

/**
 * Returns card texts by ability type
 */
export function getCardTextsByAbilityType(type: AbilityType): string[] {
  return cardTexts
    .filter((text) => detectAbilityType(text) === type)
    .slice(0, 20); // Limit to 20 examples for each type
}

/**
 * Returns card texts that couldn't be categorized
 */
export function getUncategorizedCardTexts(): string[] {
  return cardTexts.filter((text) => detectAbilityType(text) === null);
}

// Sample implementation showing how to use these functions:
/*
console.log("Card Text Analysis:");
const stats = getFullCardTextAnalysis();
console.log(`Total texts analyzed: ${stats.total}`);
console.log("By type:", stats.byType);
console.log("Pattern frequency:", stats.patterns);

console.log("\nExample Activated Abilities:");
console.log(getCardTextsByAbilityType("activated"));

console.log("\nUncategorized Texts:");
console.log(getUncategorizedCardTexts());
*/
