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

  it("accepts a legal BO3 deck while keeping sideboard cards out of main-deck size", () => {
    const deck = validDeck();
    const sideboard = sameColorCards(16)
      .slice(13)
      .map((card, index) => ({
        cardId: card.cardNumber,
        sectionId: "side",
        quantity: index === 2 ? 2 : 4,
      }));

    const result = gundamServerAdapter.validateDeckForFormat("bo3", [...deck, ...sideboard]);

    expect(result.label).toBe("Best of Three");
    expect(result.valid).toBe(true);
    expect(rule(result, "main-deck-size")?.passed).toBe(true);
    expect(rule(result, "sideboard-size")).toEqual(expect.objectContaining({ passed: true }));
  });

  it("rejects a BO3 sideboard that exceeds the shared main-and-sideboard copy limit", () => {
    const deck = validDeck();
    const sideboard = deck
      .slice(0, 3)
      .map((entry, index) => ({ ...entry, sectionId: "side", quantity: index === 2 ? 2 : 4 }));

    const result = gundamServerAdapter.validateDeckForFormat("bo3", [...deck, ...sideboard]);

    expect(result.valid).toBe(false);
    expect(rule(result, "copy-limit")).toEqual(expect.objectContaining({ passed: false }));
    expect(rule(result, "main-deck-size")).toEqual(expect.objectContaining({ passed: true }));
    expect(rule(result, "sideboard-size")).toEqual(expect.objectContaining({ passed: true }));
  });

  it("rejects BO3 sideboard cards that add a third deck color", () => {
    const deck = validDeck();
    const mainColor = cardByNumber(deck[0]!.cardId).color;
    const offColorCards = nonResourceCards().filter(
      (card) => card.color && card.color !== mainColor,
    );
    const firstOffColor = offColorCards[0];
    const secondOffColor = offColorCards.find((card) => card.color !== firstOffColor?.color);
    if (!firstOffColor || !secondOffColor) {
      throw new Error("Expected Gundam cards in at least three colors.");
    }
    const sideboard = [
      { cardId: firstOffColor.cardNumber, sectionId: "side", quantity: 4 },
      { cardId: secondOffColor.cardNumber, sectionId: "side", quantity: 4 },
      { cardId: firstOffColor.cardNumber, sectionId: "side", quantity: 2 },
    ];

    const result = gundamServerAdapter.validateDeckForFormat("bo3", [...deck, ...sideboard]);

    expect(result.valid).toBe(false);
    expect(rule(result, "deck-colors")).toEqual(expect.objectContaining({ passed: false }));
    expect(rule(result, "sideboard-size")).toEqual(expect.objectContaining({ passed: true }));
  });

  it("applies card-pool and token checks to BO3 sideboard cards", () => {
    const deck = validDeck();
    const sideboard = [
      { cardId: "GD99-999", sectionId: "side", quantity: 5 },
      { cardId: tokenCard().cardNumber, sectionId: "side", quantity: 5 },
    ];

    const result = gundamServerAdapter.validateDeckForFormat("bo3", [...deck, ...sideboard]);

    expect(result.valid).toBe(false);
    expect(rule(result, "card-pool")).toEqual(expect.objectContaining({ passed: false }));
    expect(rule(result, "tokens")).toEqual(expect.objectContaining({ passed: false }));
    expect(rule(result, "sideboard-size")).toEqual(expect.objectContaining({ passed: true }));
  });

  it("rejects cards assigned to the wrong deck section", () => {
    const deck = validDeck();
    const resource = deck.at(-1)!;
    const main = deck[0]!;
    const swapped = [
      { ...main, sectionId: "resource" },
      ...deck.slice(1, -1),
      { ...resource, sectionId: "main" },
    ];

    const result = gundamServerAdapter.validateDeckForFormat("standard", swapped);

    expect(result.valid).toBe(false);
    expect(rule(result, "deck-sections")).toEqual(expect.objectContaining({ passed: false }));
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

  it("rejects a main deck with more than two colors", () => {
    const deck = validDeck();
    const mainCards = deck.slice(0, -1);
    const baseColor = cardByNumber(mainCards[0]!.cardId).color;
    const replacementCards = nonResourceCards().filter(
      (card) => card.color && card.color !== baseColor,
    );
    const firstReplacement = replacementCards[0];
    const secondReplacement = replacementCards.find(
      (card) => card.color !== firstReplacement?.color,
    );
    if (!firstReplacement || !secondReplacement) {
      throw new Error("Expected Gundam cards in at least three colors.");
    }
    const threeColorDeck = mainCards.map((entry, index) =>
      index === 0
        ? { cardId: firstReplacement.cardNumber, quantity: entry.quantity }
        : index === 1
          ? { cardId: secondReplacement.cardNumber, quantity: entry.quantity }
          : entry,
    );
    threeColorDeck.push(deck.at(-1)!);

    const result = gundamServerAdapter.validateDeckForFormat("standard", threeColorDeck);

    expect(result.valid).toBe(false);
    expect(rule(result, "deck-colors")?.passed).toBe(false);
    expect(rule(result, "main-deck-size")?.passed).toBe(true);
    expect(rule(result, "resource-deck-size")?.passed).toBe(true);
  });
});

function rule(result: ReturnType<typeof gundamServerAdapter.validateDeckForFormat>, kind: string) {
  return result.rules.find((candidate) => candidate.kind === kind);
}

function validDeck() {
  const cards = sameColorCards(13);
  const main = cards.map((card, index) => ({
    cardId: card.cardNumber,
    quantity: index === cards.length - 1 ? 2 : 4,
  }));
  return [...main, { cardId: resourceCard().cardNumber, quantity: 10 }];
}

function sameColorCards(minimum: number): Card[] {
  const cardsByColor = new Map<string, Card[]>();
  for (const card of nonResourceCards()) {
    if (!card.color) continue;
    const cards = cardsByColor.get(card.color) ?? [];
    cards.push(card);
    cardsByColor.set(card.color, cards);
  }
  const cards = [...cardsByColor.values()].find((entries) => entries.length >= minimum);
  if (!cards) throw new Error(`Expected at least ${minimum} Gundam cards in one color.`);
  return cards.slice(0, minimum);
}

function cardByNumber(cardNumber: string): Card {
  const card = allCards().find((candidate) => candidate.cardNumber === cardNumber);
  if (!card) throw new Error(`Unknown Gundam test card ${cardNumber}.`);
  return card;
}

function nonResourceCards(): Card[] {
  return [
    ...new Map(
      allCards()
        .filter((card) => card.type !== "resource" && !isDeckListToken(card.cardNumber))
        .map((card) => [card.cardNumber, card]),
    ).values(),
  ].sort((a, b) => a.cardNumber.localeCompare(b.cardNumber));
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
