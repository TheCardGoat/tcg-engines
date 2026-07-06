import * as gundamCards from "@tcg/gundam-cards";
import { isDeckListToken } from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";
import { gundamServerAdapter } from "./adapter.js";

describe("gundamServerAdapter runtime fingerprint", () => {
  it("returns stable engine and card hashes", () => {
    const fingerprint = gundamServerAdapter.getRuntimeFingerprint?.();

    expect(fingerprint?.game).toBe("gundam");
    expect(fingerprint?.runtimeHash).toMatch(/^[0-9a-f]{8}\.[0-9a-f]{8}$/);
    expect(fingerprint?.engine?.packageName).toBe("@tcg/gundam-engine");
    expect(fingerprint?.engine?.hash).toMatch(/^[0-9a-f]{8}$/);
    expect(fingerprint?.engine?.metadata?.moveCount).toBeGreaterThan(0);
    expect(fingerprint?.cards?.packageName).toBe("@tcg/gundam-cards");
    expect(fingerprint?.cards?.hash).toMatch(/^[0-9a-f]{8}$/);
    expect(fingerprint?.cards?.metadata?.cardCount).toBeGreaterThan(0);
  });
});

describe("gundamServerAdapter.validateDeckForFormat", () => {
  it("accepts a 50-card main deck plus 10-card resource deck", () => {
    const result = gundamServerAdapter.validateDeckForFormat("standard", validDeck());

    expect(result.valid).toBe(true);
    expect(result.rules.every((rule) => rule.passed)).toBe(true);
  });

  it("rejects malformed, unknown, token, under-sized, and over-copy decks", () => {
    const [first, ...rest] = nonResourceCards();
    const token = tokenCard();
    const resource = resourceCard();
    const badDeck = [
      { cardId: first!.cardNumber, quantity: 5 },
      ...rest.slice(0, 43).map((card) => ({ cardId: card.cardNumber, quantity: 1 })),
      { cardId: token.cardNumber, quantity: 1 },
      { cardId: "GD99-999", quantity: 1 },
      { cardId: resource.cardNumber, quantity: 9 },
      { cardId: rest[44]!.cardNumber, quantity: 0 },
    ];

    const result = gundamServerAdapter.validateDeckForFormat("standard", badDeck);

    expect(result.valid).toBe(false);
    expect(rule(result, "card-pool")?.passed).toBe(false);
    expect(rule(result, "card-quantity")?.passed).toBe(false);
    expect(rule(result, "tokens")?.passed).toBe(false);
    expect(rule(result, "main-deck-size")?.passed).toBe(false);
    expect(rule(result, "resource-deck-size")?.passed).toBe(false);
    expect(rule(result, "copy-limit")?.passed).toBe(false);
  });
});

function rule(result: ReturnType<typeof gundamServerAdapter.validateDeckForFormat>, kind: string) {
  return result.rules.find((candidate) => candidate.kind === kind);
}

function validDeck() {
  const main = nonResourceCards()
    .slice(0, 50)
    .map((card) => ({ cardId: card.cardNumber, quantity: 1 }));
  return [...main, { cardId: resourceCard().cardNumber, quantity: 10 }];
}

function nonResourceCards(): Card[] {
  return allCards()
    .filter((card) => card.type !== "resource" && !isDeckListToken(card.cardNumber))
    .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber));
}

function resourceCard(): Card {
  const card = allCards().find((candidate) => candidate.type === "resource");
  if (!card) throw new Error("Expected at least one Gundam resource card.");
  return card;
}

function tokenCard(): Card {
  const card = allCards().find((candidate) => isDeckListToken(candidate.cardNumber));
  if (!card) throw new Error("Expected at least one Gundam token card.");
  return card;
}

function allCards(): Card[] {
  return Object.values(gundamCards).filter(isCard);
}

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    typeof (value as { cardNumber: unknown }).cardNumber === "string" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}
