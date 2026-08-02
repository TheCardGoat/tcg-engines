/**
 * Deck-list textarea import: one entry per line, `3xN-007` (or `3 N-007`),
 * plus a leader line `leader: N-001`. Validated via the engine's deckIssues.
 */

import { deckIssues, expandCounts } from "@tcg-engines/naruto-engine";
import type { DeckIssue, DeckList } from "@tcg-engines/naruto-engine";

export interface ParsedDeckImport {
  readonly deck: DeckList;
  /** Unparseable lines (echoed back to the user). */
  readonly errors: readonly string[];
  /** Engine legality issues for the parsed deck. */
  readonly issues: readonly DeckIssue[];
}

const COUNT_LINE = /^(\d+)\s*x?\s+?([A-Za-z][\w-]*)$/;
const COUNT_LINE_TIGHT = /^(\d+)x([A-Za-z][\w-]*)$/;
const LEADER_LINE = /^leader\s*:?\s+([A-Za-z][\w-]*)$/i;

export function parseDeckListText(text: string): ParsedDeckImport {
  let leaderId = "";
  const counts = new Map<string, number>();
  const errors: string[] = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#") || line.startsWith("//")) continue;
    const leader = LEADER_LINE.exec(line);
    if (leader?.[1]) {
      leaderId = leader[1];
      continue;
    }
    const counted = COUNT_LINE_TIGHT.exec(line) ?? COUNT_LINE.exec(line);
    if (counted?.[1] && counted[2]) {
      const qty = Number(counted[1]);
      counts.set(counted[2], (counts.get(counted[2]) ?? 0) + qty);
      continue;
    }
    errors.push(line);
  }

  const deck: DeckList = { leaderId, cardIds: expandCounts(counts) };
  return { deck, errors, issues: deckIssues(deck) };
}
