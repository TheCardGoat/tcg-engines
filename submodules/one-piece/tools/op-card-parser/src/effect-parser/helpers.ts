import type { Comparison, Condition, EffectTrigger, Zone } from "@tcg/op-types";
import { KEYWORD_BRACKETS, TRIGGER_MAP } from "./constants.ts";

export function mapTrigger(bracketContent: string): EffectTrigger | null {
  return TRIGGER_MAP[bracketContent.trim().toLowerCase()] ?? null;
}

export function isDonCondition(
  content: string,
): Extract<Condition, { condition: "donAttached" }> | null {
  // Matches: DON!! x1, DON!!x2, DON!! ×1, DON!!×2, etc.
  const match = /^don!!\s*[x×]\s*(\d+)$/i.exec(content.trim());
  if (!match) return null;
  return { condition: "donAttached", amount: parseInt(match[1]!, 10) };
}

export function isTurnCondition(content: string): Extract<Condition, { condition: "turn" }> | null {
  const lower = content.trim().toLowerCase();
  if (lower === "your turn") return { condition: "turn", value: "your" };
  if (lower === "opponent's turn") return { condition: "turn", value: "opponent" };
  return null;
}

export function isOncePerTurn(content: string): boolean {
  return content.trim().toLowerCase() === "once per turn";
}

export function isKeywordBracket(content: string): boolean {
  return KEYWORD_BRACKETS.has(content.trim().toLowerCase());
}

/**
 * Map a zone noun (from card text) to a Zone type.
 */
export function mapZoneNoun(noun: string): Zone | null {
  const lower = noun.toLowerCase().trim();
  if (lower === "character" || lower === "characters") return "character";
  if (lower === "leader" || lower === "leaders") return "leader";
  if (lower === "stage" || lower === "stages") return "stage";
  if (lower === "don!!" || lower === "don!! card" || lower === "don!! cards") return "costArea";
  return null;
}

/**
 * Parse a zone list like "Characters", "Leader or Character cards",
 * "DON!! cards or Characters", or generic "cards".
 */
export function parseZoneList(text: string): Zone[] | null {
  let cleaned = text.trim().replace(/\.+$/, "");

  // Generic "cards" = all field zones
  if (/^cards?$/i.test(cleaned)) {
    return ["leader", "character", "stage", "costArea"];
  }

  // Strip trailing " cards" / " card" unless preceded by "DON!!"
  cleaned = cleaned.replace(/(?<!DON!!)\s+cards?$/i, "").trim();

  const parts = cleaned.split(/\s+or\s+/i);
  const zones: Zone[] = [];
  for (const part of parts) {
    const zone = mapZoneNoun(part);
    if (!zone) return null;
    if (!zones.includes(zone)) zones.push(zone);
  }
  return zones.length > 0 ? zones : null;
}

/**
 * Parse a comparison suffix like "or less", "or more", or absent (exact).
 */
export function parseComparison(suffix: string | undefined): Comparison {
  if (!suffix) return "eq";
  const lower = suffix.toLowerCase();
  if (lower === "less") return "lte";
  if (lower === "more") return "gte";
  return "eq";
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
