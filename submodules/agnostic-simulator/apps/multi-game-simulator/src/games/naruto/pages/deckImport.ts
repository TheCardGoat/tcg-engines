/**
 * Deck-list textarea import: one main-deck entry per line, `3xN-007` (or
 * `3 N-007`), plus explicit `leader: N-001`, `chakra: 5xC-001`, and
 * `summon: S-001` setup lines. The side-card identities are intentionally
 * visible in the import rather than silently filled with Preview defaults.
 */

import {
  CONFIRMED_STRUCTURAL_RULES,
  deckIssues,
  expandCounts,
  practiceDeckIssues,
} from "@tcg-engines/naruto-engine";
import type { DeckIssue, DeckList } from "@tcg-engines/naruto-engine";

export interface ParsedDeckImport {
  readonly deck: DeckList;
  /** Unparseable lines (echoed back to the user). */
  readonly errors: readonly string[];
  /** Engine legality issues for the parsed deck. */
  readonly issues: readonly DeckIssue[];
  /** Issues that make engine state unsafe even for sandbox practice. */
  readonly practiceIssues: readonly DeckIssue[];
}

interface NarutoPracticeDeckPayload {
  readonly v: 2;
  readonly l: string;
  readonly m: Record<string, number>;
  readonly ca: string;
  readonly sa: string;
}

const MAX_PRACTICE_CARD_QUANTITY = 99;
const MAX_PRACTICE_MAIN_CARDS = 500;

const COUNT_LINE = /^(\d+)\s*x?\s+?([A-Za-z][\w-]*)$/;
const COUNT_LINE_TIGHT = /^(\d+)x([A-Za-z][\w-]*)$/;
const LEADER_LINE = /^leader\s*:?\s+([A-Za-z][\w-]*)$/i;
const SIDE_LINE = /^(chakra|summon)\s*:\s*(?:(\d+)\s*x?\s*)?([A-Za-z][\w-]*)$/i;

export function parseDeckListText(text: string): ParsedDeckImport {
  let leaderId = "";
  const counts = new Map<string, number>();
  const chakraCounts = new Map<string, number>();
  let summonCardId = "";
  const errors: string[] = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#") || line.startsWith("//")) continue;
    const leader = LEADER_LINE.exec(line);
    if (leader?.[1]) {
      if (leaderId) {
        errors.push(line);
        continue;
      }
      leaderId = leader[1];
      continue;
    }
    const side = SIDE_LINE.exec(line);
    if (side?.[1] && side[3]) {
      const kind = side[1].toLowerCase();
      const quantity = Number(side[2] ?? "1");
      if (!Number.isInteger(quantity) || quantity <= 0) {
        errors.push(line);
      } else if (kind === "chakra") {
        chakraCounts.set(side[3], (chakraCounts.get(side[3]) ?? 0) + quantity);
      } else if (quantity !== 1 || summonCardId) {
        errors.push(line);
      } else {
        summonCardId = side[3];
      }
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

  const deck: DeckList = {
    leaderId,
    cardIds: expandCounts(counts),
    chakraCardIds: expandCounts(chakraCounts),
    summonCardId,
  };
  return { deck, errors, issues: deckIssues(deck), practiceIssues: practiceDeckIssues(deck) };
}

/** Decodes the platform's compact `narutoPracticeDeck.v2` URL payload. */
export function parseNarutoPracticeDeckPayload(value: string): ParsedDeckImport {
  try {
    const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const parsed = JSON.parse(atob(padded)) as Partial<NarutoPracticeDeckPayload>;
    if (
      parsed.v !== 2 ||
      typeof parsed.l !== "string" ||
      typeof parsed.ca !== "string" ||
      typeof parsed.sa !== "string" ||
      !isCountMap(parsed.m)
    ) {
      return invalidPayload();
    }
    const mainCount = Object.values(parsed.m).reduce((total, quantity) => total + quantity, 0);
    if (mainCount > MAX_PRACTICE_MAIN_CARDS) return invalidPayload();
    const deck: DeckList = {
      leaderId: parsed.l,
      cardIds: expandCounts(parsed.m),
      chakraCardIds: Array.from(
        { length: CONFIRMED_STRUCTURAL_RULES.chakraCount },
        () => parsed.ca!,
      ),
      summonCardId: parsed.sa,
    };
    return {
      deck,
      errors: [],
      issues: deckIssues(deck),
      practiceIssues: practiceDeckIssues(deck),
    };
  } catch {
    return invalidPayload();
  }
}

function isCountMap(value: unknown): value is Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value).every(
    ([id, quantity]) =>
      typeof id === "string" &&
      id.length > 0 &&
      typeof quantity === "number" &&
      Number.isInteger(quantity) &&
      quantity > 0 &&
      quantity <= MAX_PRACTICE_CARD_QUANTITY,
  );
}

function invalidPayload(): ParsedDeckImport {
  return {
    deck: { leaderId: "", cardIds: [], chakraCardIds: [], summonCardId: "" },
    errors: ["Invalid Naruto deck-builder link"],
    issues: [],
    practiceIssues: [],
  };
}
