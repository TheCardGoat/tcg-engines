/**
 * Gundam Card Text Parser
 * 
 * Converts card effect text into structured ability format.
 */

import type { KeywordAbility, ParsedAbility } from "../../src/cards/card-types";

export type ParseResult = {
  keywords: KeywordAbility[];
  abilities: ParsedAbility[];
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
  "<First[- ]Strike>": "First-Strike",
  "<High[- ]Maneuver>": "High-Maneuver",
};

// ============================================================================
// TRIGGER PATTERNS
// ============================================================================

const TRIGGER_PATTERNS: Record<string, ParsedAbility["trigger"] | "ACTIVATED_MAIN" | "ACTIVATED_ACTION"> = {
  "【Deploy】": "ON_DEPLOY",
  "【Attack】": "ON_ATTACK",
  "【When Paired】": "WHEN_PAIRED",
  "【During Pair】": "DURING_PAIR",
  "【Destroyed】": "ON_DESTROY",
  "【Burst】": "ON_BURST",
  "【Activate･Main】": "ACTIVATED_MAIN",
  "【Activate･Action】": "ACTIVATED_ACTION",
};

// ============================================================================
// MAIN PARSING FUNCTION
// ============================================================================

/**
 * Parses card text into structured abilities
 */
export function parseCardText(text: string): ParseResult {
  const warnings: string[] = [];
  
  // Clean and normalize text
  const cleanText = cleanCardText(text);
  
  // Extract keywords
  const keywords = extractKeywords(cleanText);
  
  // Extract abilities
  const abilities = parseAbilityText(cleanText, warnings);
  
  return {
    keywords,
    abilities,
    warnings,
  };
}

// ============================================================================
// KEYWORD EXTRACTION
// ============================================================================

/**
 * Extracts keyword abilities from text
 */
export function extractKeywords(text: string): KeywordAbility[] {
  const keywords: KeywordAbility[] = [];
  
  for (const [pattern, keyword] of Object.entries(KEYWORD_PATTERNS)) {
    const regex = new RegExp(pattern, "gi");
    const matches = text.matchAll(regex);
    
    for (const match of matches) {
      const value = match[1] ? parseInt(match[1], 10) : undefined;
      keywords.push({ keyword, value });
    }
  }
  
  return keywords;
}

// ============================================================================
// ABILITY PARSING
// ============================================================================

/**
 * Parses ability text into structured abilities
 */
export function parseAbilityText(text: string, warnings: string[]): ParsedAbility[] {
  const abilities: ParsedAbility[] = [];
  
  // Split by timing markers
  const segments = splitByTimingMarkers(text);
  
  for (const segment of segments) {
    const ability = parseAbilitySegment(segment, warnings);
    if (ability) {
      abilities.push(ability);
    }
  }
  
  return abilities;
}

/**
 * Splits text by timing markers
 */
function splitByTimingMarkers(text: string): Array<{ trigger: string; text: string }> {
  const segments: Array<{ trigger: string; text: string }> = [];
  
  // Find all timing markers and their positions
  const markerPositions: Array<{ marker: string; pos: number }> = [];
  
  for (const marker of Object.keys(TRIGGER_PATTERNS)) {
    let pos = text.indexOf(marker);
    while (pos !== -1) {
      markerPositions.push({ marker, pos });
      pos = text.indexOf(marker, pos + 1);
    }
  }
  
  // Sort by position
  markerPositions.sort((a, b) => a.pos - b.pos);
  
  // Extract segments
  for (let i = 0; i < markerPositions.length; i++) {
    const current = markerPositions[i];
    const next = markerPositions[i + 1];
    
    const segmentText = next
      ? text.substring(current.pos, next.pos)
      : text.substring(current.pos);
    
    segments.push({
      trigger: current.marker,
      text: segmentText.replace(current.marker, "").trim(),
    });
  }
  
  // If no markers found, treat whole text as one segment
  if (segments.length === 0 && text.trim()) {
    segments.push({ trigger: "", text: text.trim() });
  }
  
  return segments;
}

/**
 * Parses a single ability segment
 */
function parseAbilitySegment(
  segment: { trigger: string; text: string },
  warnings: string[],
): ParsedAbility | null {
  if (!segment.text.trim()) {
    return null;
  }
  
  const triggerType = TRIGGER_PATTERNS[segment.trigger];
  
  // Handle activated abilities
  if (triggerType === "ACTIVATED_MAIN" || triggerType === "ACTIVATED_ACTION") {
    const timing = triggerType === "ACTIVATED_MAIN" ? "MAIN" : "ACTION";
    const cost = extractActivationCost(segment.text);
    
    return {
      activated: {
        timing,
        cost,
      },
      description: `${segment.trigger}${cost ? ` [${cost}] ` : " "}${segment.text}`,
      effect: parseEffect(segment.text, triggerType, warnings),
    };
  }
  
  // Handle triggered abilities
  if (triggerType && triggerType !== "ACTIVATED_MAIN" && triggerType !== "ACTIVATED_ACTION") {
    return {
      trigger: triggerType,
      description: `${segment.trigger} ${segment.text}`,
      effect: parseEffect(segment.text, triggerType, warnings),
    };
  }
  
  // No recognized trigger - treat as continuous or unknown
  warnings.push(`Unknown trigger pattern: ${segment.trigger || "(none)"}`);
  return {
    description: segment.text,
    effect: parseEffect(segment.text, undefined, warnings),
  };
}

// ============================================================================
// EFFECT PARSING
// ============================================================================

/**
 * Parses effect text into structured effect data
 */
function parseEffect(
  text: string,
  trigger: string | undefined,
  warnings: string[],
): ParsedAbility["effect"] {
  // Try to match common patterns
  
  // Draw pattern
  const drawMatch = text.match(/draw (\d+) cards?/i);
  if (drawMatch) {
    return {
      type: "DRAW",
      amount: parseInt(drawMatch[1], 10),
      player: "self",
    };
  }
  
  // Damage pattern
  const damageMatch = text.match(/deal (\d+) damage to (.+?)(?:\.|$)/i);
  if (damageMatch) {
    return {
      type: "DAMAGE",
      amount: parseInt(damageMatch[1], 10),
      target: parseTarget(damageMatch[2]),
    };
  }
  
  // Search pattern
  const searchMatch = text.match(/search (?:your )?deck for (.+?)(?:\.|$)/i);
  if (searchMatch) {
    return {
      type: "SEARCH_DECK",
      filter: parseSearchFilter(searchMatch[1]),
      destination: "hand",
      count: 1,
    };
  }
  
  // HP recovery pattern
  const recoverMatch = text.match(/(?:recovers?|gains?) (\d+) HP/i);
  if (recoverMatch) {
    return {
      type: "RECOVER_HP",
      amount: parseInt(recoverMatch[1], 10),
      target: { type: "self" },
    };
  }
  
  // Stat modification pattern
  const statMatch = text.match(/(AP|HP)([+-]\d+)/i);
  if (statMatch) {
    return {
      type: "MODIFY_STATS",
      attribute: statMatch[1].toLowerCase(),
      modifier: parseInt(statMatch[2], 10),
      duration: "turn",
    };
  }
  
  // Default: unknown effect
  warnings.push(`Could not parse effect: ${text}`);
  return {
    type: "UNKNOWN",
    rawText: text,
  };
}

/**
 * Extracts activation cost from text
 */
function extractActivationCost(text: string): string | undefined {
  const costMatch = text.match(/^\[([^\]]+)\]/);
  return costMatch ? costMatch[1] : undefined;
}

/**
 * Parses target text
 */
function parseTarget(targetText: string): unknown {
  const lowerText = targetText.toLowerCase();
  
  if (lowerText.includes("enemy") && lowerText.includes("unit")) {
    return {
      type: "unit",
      controller: "opponent",
      filter: { zone: "battle-area" },
    };
  }
  
  if (lowerText.includes("friendly") || lowerText.includes("your")) {
    return {
      type: "unit",
      controller: "self",
      filter: { zone: "battle-area" },
    };
  }
  
  if (lowerText.includes("opponent")) {
    return {
      type: "player",
      controller: "opponent",
    };
  }
  
  return {
    type: "unknown",
    rawText: targetText,
  };
}

/**
 * Parses search filter text
 */
function parseSearchFilter(filterText: string): unknown {
  const filter: Record<string, unknown> = {};
  
  // Extract card type
  if (filterText.includes("Pilot")) {
    filter.cardType = "PILOT";
  } else if (filterText.includes("Unit")) {
    filter.cardType = "UNIT";
  }
  
  // Extract card name
  const nameMatch = filterText.match(/named ['"]([^'"]+)['"]/);
  if (nameMatch) {
    filter.name = nameMatch[1];
  }
  
  // Extract level
  const levelMatch = filterText.match(/(?:level|Lv\.?) (\d+)/i);
  if (levelMatch) {
    filter.level = parseInt(levelMatch[1], 10);
  }
  
  return filter;
}

// ============================================================================
// TEXT CLEANING
// ============================================================================

/**
 * Cleans and normalizes card text
 */
export function cleanCardText(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<br>/g, "\n")
    .replace(/<\/br>/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

