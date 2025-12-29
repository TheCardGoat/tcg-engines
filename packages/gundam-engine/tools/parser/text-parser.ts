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
  "<Suppression>": "Suppression",
  "<First[- ]Strike>": "First-Strike",
  "<High[- ]Maneuver>": "High-Maneuver",
};

// ============================================================================
// TRIGGER PATTERNS
// ============================================================================

// Separate patterns for conditions and triggers
const CONDITION_PATTERNS: Record<string, ParsedAbility["condition"]> = {
  "【During Link】": "DURING_LINK",
  "【During Pair】": "DURING_PAIR",
};

const TRIGGER_PATTERNS: Record<
  string,
  ParsedAbility["trigger"] | "ACTIVATED_MAIN" | "ACTIVATED_ACTION"
> = {
  "【Deploy】": "ON_DEPLOY",
  "【Attack】": "ON_ATTACK",
  "【When Paired】": "WHEN_PAIRED",
  "【When Linked】": "WHEN_LINKED",
  "【Destroyed】": "ON_DESTROYED",
  "【Burst】": "ON_BURST",
  "【Activate･Main】": "ACTIVATED_MAIN",
  "【Activate･Action】": "ACTIVATED_ACTION",
};

// Combined patterns for finding all timing markers
const ALL_TIMING_PATTERNS = {
  ...CONDITION_PATTERNS,
  ...TRIGGER_PATTERNS,
};

// Maximum allowed gap between consecutive timing markers (in characters)
// This allows for small spaces or formatting between condition and trigger markers
const MAX_MARKER_GAP = 10;

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
      const value = match[1] ? Number.parseInt(match[1], 10) : undefined;
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
export function parseAbilityText(
  text: string,
  warnings: string[],
): ParsedAbility[] {
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
function splitByTimingMarkers(
  text: string,
): Array<{ markers: string[]; text: string }> {
  const segments: Array<{ markers: string[]; text: string }> = [];

  // Find all timing markers and their positions
  const markerPositions: Array<{ marker: string; pos: number }> = [];

  for (const marker of Object.keys(ALL_TIMING_PATTERNS)) {
    let pos = text.indexOf(marker);
    while (pos !== -1) {
      markerPositions.push({ marker, pos });
      pos = text.indexOf(marker, pos + 1);
    }
  }

  // Sort by position
  markerPositions.sort((a, b) => a.pos - b.pos);

  // Group consecutive markers to handle conditional triggers
  const groupedMarkers: Array<{
    markers: string[];
    pos: number;
    endPos: number;
  }> = [];
  let currentGroup: { markers: string[]; pos: number; endPos: number } | null =
    null;

  for (let i = 0; i < markerPositions.length; i++) {
    const current = markerPositions[i];
    const next = markerPositions[i + 1];

    if (currentGroup) {
      // Check if this marker is immediately after the previous one (conditional trigger)
      const prevEndPos =
        currentGroup.pos +
        currentGroup.markers[currentGroup.markers.length - 1].length;
      if (current.pos <= prevEndPos + MAX_MARKER_GAP) {
        // Allow small gaps between markers
        currentGroup.markers.push(current.marker);
      } else {
        // Close current group and start a new one
        currentGroup.endPos = current.pos;
        groupedMarkers.push(currentGroup);
        currentGroup = {
          markers: [current.marker],
          pos: current.pos,
          endPos: -1,
        };
      }
    } else {
      currentGroup = {
        markers: [current.marker],
        pos: current.pos,
        endPos: -1,
      };
    }
  }

  // Add the last group
  if (currentGroup) {
    currentGroup.endPos = text.length;
    groupedMarkers.push(currentGroup);
  }

  // Extract segments based on grouped markers
  for (let i = 0; i < groupedMarkers.length; i++) {
    const current = groupedMarkers[i];
    const next = groupedMarkers[i + 1];

    const segmentText = next
      ? text.substring(current.pos, next.pos)
      : text.substring(current.pos);

    // Remove all markers from the text
    let cleanText = segmentText;
    for (const marker of current.markers) {
      cleanText = cleanText.replace(marker, "").trim();
    }

    segments.push({
      markers: current.markers,
      text: cleanText,
    });
  }

  // If no markers found, treat whole text as one segment
  if (segments.length === 0 && text.trim()) {
    segments.push({ markers: [], text: text.trim() });
  }

  return segments;
}

/**
 * Parses a single ability segment
 */
function parseAbilitySegment(
  segment: { markers: string[]; text: string },
  warnings: string[],
): ParsedAbility | null {
  if (!segment.text.trim()) {
    return null;
  }

  // Parse markers to identify conditions and triggers
  let condition: ParsedAbility["condition"] | undefined;
  let trigger: ParsedAbility["trigger"] | undefined;
  let activatedTiming: "MAIN" | "ACTION" | undefined;
  const unknownMarkers: string[] = [];

  for (const marker of segment.markers) {
    if (CONDITION_PATTERNS[marker]) {
      condition = CONDITION_PATTERNS[marker];
    } else if (TRIGGER_PATTERNS[marker]) {
      const triggerType = TRIGGER_PATTERNS[marker];
      if (triggerType === "ACTIVATED_MAIN") {
        activatedTiming = "MAIN";
      } else if (triggerType === "ACTIVATED_ACTION") {
        activatedTiming = "ACTION";
      } else {
        trigger = triggerType;
      }
    } else {
      unknownMarkers.push(marker);
    }
  }

  // Handle unknown markers
  if (unknownMarkers.length > 0) {
    warnings.push(`Unknown trigger pattern(s): ${unknownMarkers.join(", ")}`);
  }

  const description = `${segment.markers.join(" ")} ${segment.text}`;

  // Handle activated abilities
  if (activatedTiming) {
    const cost = extractActivationCost(segment.text);

    return {
      condition,
      activated: {
        timing: activatedTiming,
        cost,
      },
      description,
      effect: parseEffect(segment.text, warnings),
    };
  }

  // Handle triggered abilities
  if (trigger) {
    return {
      condition,
      trigger,
      description,
      effect: parseEffect(segment.text, warnings),
    };
  }

  // Handle condition-only abilities (continuous effects during certain conditions)
  if (condition) {
    return {
      condition,
      description,
      effect: parseEffect(segment.text, warnings),
    };
  }

  // No recognized trigger - treat as continuous or unknown
  return {
    description,
    effect: parseEffect(segment.text, warnings),
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
  warnings: string[],
): ParsedAbility["effect"] {
  // Try to match common patterns

  // Draw pattern
  const drawMatch = text.match(/draw (\d+) cards?/i);
  if (drawMatch) {
    return {
      type: "DRAW",
      amount: Number.parseInt(drawMatch[1], 10),
      player: "self",
    };
  }

  // Damage pattern
  const damageMatch = text.match(/deal (\d+) damage to (.+?)(?:\.|$)/i);
  if (damageMatch) {
    return {
      type: "DAMAGE",
      amount: Number.parseInt(damageMatch[1], 10),
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
      amount: Number.parseInt(recoverMatch[1], 10),
      target: { type: "self" },
    };
  }

  // Stat modification pattern
  const statMatch = text.match(/(AP|HP)([+-]\d+)/i);
  if (statMatch) {
    return {
      type: "MODIFY_STATS",
      attribute: statMatch[1].toLowerCase(),
      modifier: Number.parseInt(statMatch[2], 10),
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
    filter.level = Number.parseInt(levelMatch[1], 10);
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
    .replace(/<br\s*\/?>/gi, "<!BR!>") // Temporary placeholder
    .replace(/<\/br>/g, "<!BR!>")
    .replace(/\s+/g, " ") // Collapse all whitespace
    .replace(/<!BR!>/g, "\n\n") // Restore intentional line breaks
    .trim();
}
