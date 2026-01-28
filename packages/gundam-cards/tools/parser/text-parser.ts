/**
 * Gundam Card Text Parser
 *
 * Converts card effect text into structured ability format.
 */

import type {
  ActivatedEffect,
  BaseEffect,
  ConstantEffect,
  Effect,
  KeywordAbility,
  TargetQuery,
  TriggeredEffect,
} from "@tcg/gundam-types";
import { parseAction } from "./stages/action-parser";
import { extractHeaders } from "./stages/header-extraction";
import { normalizeText } from "./stages/normalization";
import { splitIntoSegments } from "./stages/segmentation";
import { parseTarget } from "./stages/target-parser";

export type ParseResult = {
  keywords: KeywordAbility[];
  effects: Effect[];
  warnings: string[];
};

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
    // e.g. <Blocker> (Rest this unit to redirect...)
    // Only remove if it matched the extraction criteria (inherent keyword)
    const prefix =
      "(?<!\\b(?:gain|gains|get|gets|have|has|grant|grants|give|gives)\\s*)";
    const fullPattern = prefix + pattern + "(?:\\s*\\([^)]+\\))?";
    textToParse = textToParse.replace(new RegExp(fullPattern, "gi"), "");
  }

  // Cleanup any leftover double spaces
  textToParse = textToParse.replace(/\s+/g, " ").trim();

  const effects: Effect[] = [];
  const segments = splitIntoSegments(textToParse);

  for (const segment of segments) {
    if (!segment.rawText) continue;

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

    let effect: Effect;

    if (markers.includes("Activate")) {
      const timing = markers.includes("Main") ? "MAIN" : "ACTION";
      effect = {
        id,
        type: "ACTIVATED",
        timing,
        description: segment.rawText,
        restrictions,
        costs,
        conditions,
        action,
      } as ActivatedEffect;
    } else if (
      markers.includes("Deploy") ||
      markers.includes("Attack") ||
      markers.includes("Destroyed") ||
      markers.includes("When") ||
      markers.includes("Burst")
    ) {
      let timing: TriggeredEffect["timing"] = "DEPLOY";
      if (markers.includes("Deploy")) timing = "DEPLOY";
      else if (markers.includes("Attack")) timing = "ATTACK";
      else if (markers.includes("Destroyed")) timing = "DESTROYED";
      else if (markers.includes("When Paired")) timing = "WHEN_PAIRED";
      else if (markers.includes("When Linked")) timing = "WHEN_LINKED";
      else if (markers.includes("Burst")) timing = "BURST";

      effect = {
        id,
        type: "TRIGGERED",
        timing,
        description: segment.rawText,
        restrictions,
        costs,
        conditions,
        action,
      } as TriggeredEffect;
    } else {
      // Constant Effect (or Command, but parser context doesn't know card type yet)
      effect = {
        id,
        type: "CONSTANT",
        description: segment.rawText,
        restrictions,
        conditions,
        action,
      } as ConstantEffect;
    }

    effects.push(effect);
  }

  return {
    keywords,
    effects,
    warnings,
  };
}

// Re-export for compatibility with tests
export const cleanCardText = normalizeText;
