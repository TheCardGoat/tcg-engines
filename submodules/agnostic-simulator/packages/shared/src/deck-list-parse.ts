/**
 * Parse community-format deck list text into playable entries.
 *
 * Supports:
 * - Lines: {NUMBER} {FULL CARD NAME} with optional trailing (SET) or (PROMO)/(ENCHANTED)/(EPIC)
 * - Sections: --- SIDEBOARD (merged into playable list), --- MAYBEBOARD (ignored)
 *
 * Output is main + side merged; maybeboard is excluded. Card names are trimmed and
 * trailing parentheticals are stripped for lookup.
 */

import type { DeckListInvalidEntry } from "./deck-list-errors";

export type ParsedDeckListEntry = { quantity: number; cardName: string };

const LINE_REGEX = /^\s*(\d+)\s+(.+)$/;
const SIDEBOARD_MARKER = /^---\s*SIDEBOARD\s*$/i;
const MAYBEBOARD_MARKER = /^---\s*MAYBEBOARD\s*$/i;

/** Strip trailing parenthetical like (Set), (PROMO), (ENCHANTED), (EPIC) for canonical lookup. */
function stripTrailingParenthetical(name: string): string {
  const trimmed = name.trim();
  const match = trimmed.match(/^(.+?)\s*\([^)]+\)\s*$/);
  if (match) {
    const cap = match[1];
    if (cap !== undefined) {
      const inner = cap.trim();
      if (inner.length > 0) return inner;
    }
  }
  return trimmed;
}

/**
 * Parse community-format deck list text into playable entries (main + side, no maybeboard).
 * Blank lines and section headers are skipped. Card names are trimmed and trailing
 * parentheticals (e.g. set code or variant) are stripped for lookup.
 */
export function parseDeckListText(text: string): ParsedDeckListEntry[] {
  const result: ParsedDeckListEntry[] = [];
  type Section = "main" | "side" | "maybe";
  let section: Section = "main";

  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;

    if (SIDEBOARD_MARKER.test(trimmed)) {
      section = "side";
      continue;
    }
    if (MAYBEBOARD_MARKER.test(trimmed)) {
      section = "maybe";
      continue;
    }

    if (section === "maybe") continue;

    const match = trimmed.match(LINE_REGEX);
    if (!match) continue;

    const qStr = match[1];
    const rawNamePart = match[2];
    if (qStr === undefined || rawNamePart === undefined) continue;

    const quantity = parseInt(qStr, 10);
    if (isNaN(quantity) || quantity <= 0) continue;

    const rawName = rawNamePart.trim();
    if (rawName === "") continue;

    const cardName = stripTrailingParenthetical(rawName);
    result.push({ quantity, cardName });
  }

  return result;
}

/**
 * Like parseDeckListText but also returns invalid lines as malformed entries.
 * Section headers and blank lines are skipped and do not appear in invalid.
 */
export function parseDeckListTextWithErrors(text: string): {
  entries: ParsedDeckListEntry[];
  invalid: DeckListInvalidEntry[];
} {
  const entries: ParsedDeckListEntry[] = [];
  const invalid: DeckListInvalidEntry[] = [];
  type Section = "main" | "side" | "maybe";
  let section: Section = "main";

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) continue;
    const trimmed = line.trim();
    const lineNumber = i + 1;

    if (trimmed === "") continue;

    if (SIDEBOARD_MARKER.test(trimmed)) {
      section = "side";
      continue;
    }
    if (MAYBEBOARD_MARKER.test(trimmed)) {
      section = "maybe";
      continue;
    }

    if (section === "maybe") continue;

    const match = trimmed.match(LINE_REGEX);
    if (!match) {
      invalid.push({ kind: "malformed", text: trimmed, lineNumber });
      continue;
    }

    const qStr = match[1];
    const rawNamePart = match[2];
    if (qStr === undefined || rawNamePart === undefined) {
      invalid.push({ kind: "malformed", text: trimmed, lineNumber });
      continue;
    }

    const quantity = parseInt(qStr, 10);
    if (isNaN(quantity) || quantity <= 0) {
      invalid.push({ kind: "malformed", text: trimmed, lineNumber });
      continue;
    }

    const rawName = rawNamePart.trim();
    if (rawName === "") {
      invalid.push({ kind: "malformed", text: trimmed, lineNumber });
      continue;
    }

    const cardName = stripTrailingParenthetical(rawName);
    entries.push({ quantity, cardName });
  }

  return { entries, invalid };
}
