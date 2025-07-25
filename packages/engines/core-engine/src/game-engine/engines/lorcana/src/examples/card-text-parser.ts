/**
 * This file contains utility functions for parsing card text into ability data.
 * It provides a simple API for integrating with the game engine.
 */

import type { AbilityType } from "../abilities/ability-types";
import { detectAbilityType, splitAbilityText } from "./ability-type-mapping";

/**
 * Represents a parsed ability from card text
 */
export interface ParsedAbility {
  text: string;
  abilityType: AbilityType | null;
  // Additional parsed components
  hasCost: boolean;
  hasTarget: boolean;
  hasCondition: boolean;
  hasDuration: boolean;
}

/**
 * Utility class for parsing card text into ability data
 */
export class CardTextParser {
  /**
   * Parses a card text into a structured ability representation
   * @param cardText The raw card text to parse
   */
  static parseAbility(cardText: string): ParsedAbility {
    if (!cardText) {
      return {
        text: "",
        abilityType: null,
        hasCost: false,
        hasTarget: false,
        hasCondition: false,
        hasDuration: false,
      };
    }

    const cleanText = cardText.trim();
    const abilityType = detectAbilityType(cleanText);

    // Identify cost patterns
    const hasCost =
      cleanText.includes("{E}") ||
      cleanText.includes("{I}") ||
      cleanText.includes("{e}") ||
      cleanText.includes("Choose and discard") ||
      (cleanText.includes("Banish") &&
        (cleanText.includes("–") ||
          cleanText.includes("-") ||
          cleanText.includes("−")));

    // Identify target patterns
    const hasTarget =
      cleanText.includes("chosen") ||
      cleanText.includes("Chosen") ||
      cleanText.includes("each") ||
      cleanText.includes("all") ||
      cleanText.includes("target") ||
      cleanText.includes("opposing character") ||
      cleanText.includes("your character");

    // Identify condition patterns
    const hasCondition =
      cleanText.includes("if ") ||
      cleanText.includes("If ") ||
      cleanText.includes("unless") ||
      cleanText.startsWith("While") ||
      cleanText.includes("while") ||
      cleanText.includes("for each");

    // Identify duration patterns
    const hasDuration =
      cleanText.includes("this turn") ||
      cleanText.includes("until") ||
      cleanText.includes("for the rest of this turn") ||
      cleanText.includes("next turn");

    return {
      text: cleanText,
      abilityType,
      hasCost,
      hasTarget,
      hasCondition,
      hasDuration,
    };
  }

  /**
   * Splits a card text with multiple abilities and parses each one
   * @param cardText The raw card text to parse
   */
  static parseCardText(cardText: string): ParsedAbility[] {
    if (!cardText) {
      return [];
    }

    const abilityParts = splitAbilityText(cardText.trim());
    return abilityParts.map((part) => CardTextParser.parseAbility(part));
  }

  /**
   * Checks if a card text represents an activated ability
   * @param cardText The raw card text to check
   */
  static isActivatedAbility(cardText: string): boolean {
    return detectAbilityType(cardText) === "activated";
  }

  /**
   * Checks if a card text represents a triggered ability
   * @param cardText The raw card text to check
   */
  static isTriggeredAbility(cardText: string): boolean {
    return detectAbilityType(cardText) === "triggered";
  }

  /**
   * Checks if a card text represents a static ability
   * @param cardText The raw card text to check
   */
  static isStaticAbility(cardText: string): boolean {
    return detectAbilityType(cardText) === "static";
  }

  /**
   * Checks if a card text represents a keyword ability
   * @param cardText The raw card text to check
   */
  static isKeywordAbility(cardText: string): boolean {
    return detectAbilityType(cardText) === "keyword";
  }

  /**
   * Checks if a card text represents a replacement effect
   * @param cardText The raw card text to check
   */
  static isReplacementEffect(cardText: string): boolean {
    return detectAbilityType(cardText) === "replacement";
  }

  /**
   * Extracts keyword abilities from a card text
   * @param cardText The raw card text to process
   */
  static extractKeywords(cardText: string): string[] {
    if (!cardText) return [];

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

    const foundKeywords: string[] = [];

    // Handle multi-line text by splitting and checking each line first
    if (cardText.includes("\n")) {
      const lines = cardText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      for (const line of lines) {
        // Check for standalone keywords in each line
        CardTextParser.checkForKeywords(line, keywords, foundKeywords);

        // Check for keywords with values in each line
        CardTextParser.checkForKeywordsWithValues(
          line,
          keywords,
          foundKeywords,
        );
      }
    } else {
      // Single line text
      CardTextParser.checkForKeywords(cardText, keywords, foundKeywords);
      CardTextParser.checkForKeywordsWithValues(
        cardText,
        keywords,
        foundKeywords,
      );
    }

    // Also process the full text in case there are keywords that span multiple lines
    const parts = splitAbilityText(cardText);
    parts.forEach((part) => {
      CardTextParser.checkForKeywords(part, keywords, foundKeywords);
      CardTextParser.checkForKeywordsWithValues(part, keywords, foundKeywords);
    });

    return foundKeywords;
  }

  /**
   * Helper method to check for simple keywords in text
   */
  private static checkForKeywords(
    text: string,
    keywords: string[],
    foundKeywords: string[],
  ): void {
    const cleanText = text.trim();

    // Check for exact matches
    for (const keyword of keywords) {
      if (cleanText === keyword && !foundKeywords.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    }

    // Check for keywords at the start with description in parentheses
    if (cleanText.includes("(")) {
      for (const keyword of keywords) {
        if (cleanText.startsWith(keyword) && !foundKeywords.includes(keyword)) {
          foundKeywords.push(keyword);
        }
      }
    }
  }

  /**
   * Helper method to check for keywords with values in text
   */
  private static checkForKeywordsWithValues(
    text: string,
    keywords: string[],
    foundKeywords: string[],
  ): void {
    const cleanText = text.trim();

    for (const keyword of keywords) {
      // Keyword with value (e.g., "Challenger +2")
      const withValueRegex = new RegExp(`^${keyword}\\s*\\+\\d+$`);
      if (
        withValueRegex.test(cleanText) &&
        !foundKeywords.includes(cleanText)
      ) {
        foundKeywords.push(cleanText);
      }

      // Keyword with numeric value (e.g., "Shift 3")
      const withNumericRegex = new RegExp(`^${keyword}\\s+\\d+$`);
      if (
        withNumericRegex.test(cleanText) &&
        !foundKeywords.includes(cleanText)
      ) {
        foundKeywords.push(cleanText);
      }
    }
  }
}

// Example usage:
/*
const cardText = "Evasive (Only characters with Evasive can challenge this character.)\nWhen you play this character, gain 1 lore.";
const abilities = CardTextParser.parseCardText(cardText);
console.log('Parsed abilities:', abilities);
console.log('Keywords:', CardTextParser.extractKeywords(cardText));
*/
