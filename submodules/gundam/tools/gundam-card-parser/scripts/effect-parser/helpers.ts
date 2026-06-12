import type { CardType, KeywordEffect } from "@tcg/gundam-types";
import type { EffectDuration } from "@tcg/gundam-types";

// ─────────────────────────────────────────────────────────────────────────────
// HTML cleaning
// ─────────────────────────────────────────────────────────────────────────────

export function cleanHtml(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/･/g, "·") // normalize middle dots
    .replace(/•/g, "·")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyword effect map
// ─────────────────────────────────────────────────────────────────────────────

export const KEYWORD_EFFECT_MAP: Record<string, KeywordEffect> = {
  repair: "Repair",
  breach: "Breach",
  support: "Support",
  blocker: "Blocker",
  "first strike": "FirstStrike",
  "first-strike": "FirstStrike",
  "high-maneuver": "HighManeuver",
  "high maneuver": "HighManeuver",
  suppression: "Suppression",
};

export function parseKeywordEffectName(name: string): KeywordEffect | undefined {
  return KEYWORD_EFFECT_MAP[name.toLowerCase().trim()];
}

// ─────────────────────────────────────────────────────────────────────────────
// Card type detection
// ─────────────────────────────────────────────────────────────────────────────

export function parseCardType(text: string): CardType | undefined {
  const t = text.toLowerCase();
  if (t.includes("unit")) return "unit";
  if (t.includes("pilot")) return "pilot";
  if (t.includes("command")) return "command";
  if (t.includes("base")) return "base";
  if (t.includes("resource")) return "resource";
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Duration parsing
// ─────────────────────────────────────────────────────────────────────────────

export function parseDuration(text: string): EffectDuration {
  const t = text.toLowerCase();
  if (t.includes("during this battle") || t.includes("this battle")) return "thisBattle";
  if (t.includes("during this turn") || t.includes("this turn") || t.includes("until end of turn"))
    return "thisTurn";
  if (t.includes("while linked") || t.includes("while this unit is linked")) return "whileLinked";
  return "permanent";
}

// ─────────────────────────────────────────────────────────────────────────────
// Card color map
// ─────────────────────────────────────────────────────────────────────────────

import type { CardColor } from "@tcg/gundam-types";

export const CARD_COLORS: Record<string, CardColor> = {
  red: "red",
  blue: "blue",
  green: "green",
  white: "white",
  purple: "purple",
};
