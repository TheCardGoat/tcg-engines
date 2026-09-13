import { describe, expect, it } from "vite-plus/test";
import { validateDeckList, type DeckList } from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";
import * as cardExports from "../cards/index.ts";
import { seedAggroPrintNPlayDeckList } from "./seed-aggro-print-n-play-deck.ts";

function isCard(value: unknown): value is Card {
  return typeof value === "object" && value !== null && "cardNumber" in value && "type" in value;
}

function parseStarterDeck(): DeckList {
  const lines = seedAggroPrintNPlayDeckList
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const mainDeckIndex = lines.findIndex((line) => line.startsWith("Main Deck"));
  const resourceDeckIndex = lines.findIndex((line) => line.startsWith("Resource Deck"));
  const parseEntry = (line: string) => {
    const match = line.match(/^(\d+)\s+([A-Z0-9]+-\d+)/i);
    if (!match) throw new Error(`Invalid starter deck line: ${line}`);
    return { cardNumber: match[2]!, count: Number.parseInt(match[1]!, 10) };
  };
  const resource = parseEntry(lines[resourceDeckIndex + 1]!);

  return {
    name: lines[0]!,
    cards: lines.slice(mainDeckIndex + 1, resourceDeckIndex).map(parseEntry),
    resource,
  };
}

describe("SEED Aggro print-and-play starter", () => {
  it("is a legal, catalog-backed Gundam deck", () => {
    const catalog = new Map(
      Object.values(cardExports)
        .filter(isCard)
        .map((card) => [card.cardNumber, card]),
    );

    const result = validateDeckList(parseStarterDeck(), { catalog });

    expect(result.ok).toBe(true);
  });
});
