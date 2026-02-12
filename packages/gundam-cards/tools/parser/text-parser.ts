/**
 * Gundam Card Text Parser
 *
 * Converts card effect text into structured ability format.
 *
 * NOTE: This parser currently returns legacy BaseEffect shapes for backward
 * compatibility. Use legacyToNewEffects() to convert to the new Effect type.
 */

import type {
  ActivatedEffect,
  BaseEffect,
  ConstantEffect,
  KeywordAbility,
  TargetQuery,
  TriggeredEffect,
} from "@tcg/gundam-types";
import { parseAction } from "./stages/action-parser";
import { extractHeaders } from "./stages/header-extraction";
import { normalizeText } from "./stages/normalization";
import { splitIntoSegments } from "./stages/segmentation";
import { parseTarget } from "./stages/target-parser";

export interface ParseResult {
  keywords: KeywordAbility[];
  effects: BaseEffect[];
  warnings: string[];
}

// ============================================================================
// KEYWORD PATTERNS
// ============================================================================

const KEYWORD_PATTERNS: Record<string, KeywordAbility["keyword"]> = {
  "<Repair(?: (\\d+))?>": "Repair",
  "<Breach(?: (\\d+))?>": "Breach",
  "<Support(?: (\\d+))?>": "Support",
  "<Blocker>": "Blocker",
  "<Suppression>": "Suppression",
  "<First[- ]Strike>": "First-Strike",
  "<High[- ]Maneuver>": "High-Maneuver",
};

/**
 * Extracts keyword abilities from text
 */
export function extractKeywords(text: string): KeywordAbility[] {
  const keywords: KeywordAbility[] = [];
  for (const [pattern, keyword] of Object.entries(KEYWORD_PATTERNS)) {
    // Only match if NOT preceded by gain/get/have/grant verbs
    const regexSource = `(?<!\\b(?:gain|gains|get|gets|have|has|grant|grants|give|gives)\\s*)${pattern}`;
    const regex = new RegExp(regexSource, "gi");

    const matches = text.matchAll(regex);
    for (const match of matches) {
      const value = match[1] ? Number.parseInt(match[1], 10) : undefined;
      keywords.push({ keyword, value });
    }
  }
  return keywords;
}

/**
 * Parses card text into structured abilities
 */
export function parseCardText(text: string): ParseResult {
  const warnings: string[] = [];
  const clean = normalizeText(text);
  const keywords = extractKeywords(clean);

  // Remove keywords and their reminder text
  let textToParse = clean;
  for (const [pattern, _] of Object.entries(KEYWORD_PATTERNS)) {
    // Match keyword + optional space + optional reminder text in parens
    // E.g. <Blocker> (Rest this unit to redirect...)
    // Only remove if it matched the extraction criteria (inherent keyword)
    const prefix =
      String.raw`(?<!\b(?:gain|gains|get|gets|have|has|grant|grants|give|gives)\s*)`;
    const fullPattern = prefix + pattern + String.raw`(?:\s*\([^)]+\))?`;
    textToParse = textToParse.replace(new RegExp(fullPattern, "gi"), "");
  }

  // Cleanup any leftover double spaces
  textToParse = textToParse.replace(/\s+/g, " ").trim();

  const effects: BaseEffect[] = [];
  const segments = splitIntoSegments(textToParse);

  for (const segment of segments) {
    if (!segment.rawText) {continue;}

    // Extract headers (restrictions, costs, etc.) from the segment text
    const { restrictions, costs, conditions, cleanText } = extractHeaders(
      segment.rawText,
    );

    // Parse target context if present
    let processing = cleanText;
    let contextTarget: TargetQuery | TargetQuery[] | undefined;

    const targetRes = parseTarget(processing);
    if (targetRes) {
      contextTarget = targetRes.query;
      processing = targetRes.remainingText;
      // Cleanup punctuation/spacing
      processing = processing.replace(/^\.\s*/, "");
      // "It recovers..." -> "recovers..."
      processing = processing.replace(/^It\s+/i, "");
      // "They..."
      processing = processing.replace(/^They\s+/i, "");
    }

    // Parse the core action
    const action = parseAction(processing, contextTarget);

    const id = `eff-${Math.random().toString(36).substr(2, 9)}`;
    const markers = segment.markers.join(" ");

    let effect: BaseEffect;

    if (markers.includes("Activate")) {
      const timing = markers.includes("Main") ? "MAIN" : "ACTION";
      effect = {
        action,
        conditions,
        costs,
        description: segment.rawText,
        id,
        restrictions,
        timing,
        type: "ACTIVATED",
      } as BaseEffect;
    } else if (
      markers.includes("Deploy") ||
      markers.includes("Attack") ||
      markers.includes("Destroyed") ||
      markers.includes("When") ||
      markers.includes("Burst")
    ) {
      let timing:
        | "DEPLOY"
        | "ATTACK"
        | "DESTROYED"
        | "BURST"
        | "WHEN_PAIRED"
        | "WHEN_LINKED" = "DEPLOY";
      if (markers.includes("Deploy")) {timing = "DEPLOY";}
      else if (markers.includes("Attack")) {timing = "ATTACK";}
      else if (markers.includes("Destroyed")) {timing = "DESTROYED";}
      else if (markers.includes("When Paired")) {timing = "WHEN_PAIRED";}
      else if (markers.includes("When Linked")) {timing = "WHEN_LINKED";}
      else if (markers.includes("Burst")) {timing = "BURST";}

      effect = {
        action,
        conditions,
        costs,
        description: segment.rawText,
        id,
        restrictions,
        timing,
        type: "TRIGGERED",
      } as BaseEffect;
    } else {
      // Constant Effect (or Command, but parser context doesn't know card type yet)
      effect = {
        action,
        conditions,
        description: segment.rawText,
        id,
        restrictions,
        type: "CONSTANT",
      } as BaseEffect;
    }

    effects.push(effect);
  }

  return {
    effects,
    keywords,
    warnings,
  };
}

// Re-export for compatibility with tests
export const cleanCardText = normalizeText;
