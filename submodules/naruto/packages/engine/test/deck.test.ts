import { describe, expect, it } from "vitest";

import {
  buildDeck,
  deckIssues,
  isLegalDeck,
  poolForLeader,
  repairDeck,
} from "../src/setup";

describe("deck validation", () => {
  it("flags a missing leader", () => {
    expect(deckIssues({ leaderId: "", cardIds: [] })).toEqual(["noLeader"]);
  });

  it("flags an unknown or non-leader leader", () => {
    expect(deckIssues({ leaderId: "NOPE-1", cardIds: [] })).toEqual(["unknownLeader"]);
    expect(deckIssues({ leaderId: "N-004", cardIds: [] })).toEqual(["unknownLeader"]);
  });

  it("flags wrong deck size", () => {
    expect(deckIssues({ leaderId: "N-001", cardIds: ["N-004"] })).toContain("wrongSize");
  });

  it("flags non-character cards in the deck", () => {
    const deck = buildDeck("N-001");
    const cardIds = [...deck.cardIds];
    cardIds[0] = "N-001"; // a leader is not a character
    expect(deckIssues({ leaderId: "N-001", cardIds })).toContain("notACharacter");
  });

  it("flags off-color cards", () => {
    // N-001 is red; N-012/N-013 are blue Uchiha cards.
    const cardIds = Array.from({ length: 50 }, (_, i) => (i === 0 ? "N-013" : "N-004"));
    expect(deckIssues({ leaderId: "N-001", cardIds })).toContain("wrongColor");
  });

  it("poolForLeader only offers on-color characters and EX characters", () => {
    for (const card of poolForLeader("N-001")) {
      expect(["character", "ex_character"]).toContain(card.cardType);
      expect(["red", ""]).toContain(card.color);
    }
    for (const card of poolForLeader("N-012")) {
      expect(["character", "ex_character"]).toContain(card.cardType);
      expect(["blue", ""]).toContain(card.color);
    }
  });

  it("flags more than 4 copies of a card", () => {
    const cardIds = [
      ...Array.from({ length: 5 }, () => "N-004"),
      ...Array.from({ length: 45 }, (_, i) => (i % 2 === 0 ? "N-006" : "N-007")),
    ];
    expect(deckIssues({ leaderId: "N-001", cardIds })).toContain("tooManyCopies");
  });

  it("repairDeck fixes an illegal deck", () => {
    const broken = {
      leaderId: "N-001",
      cardIds: [
        ...Array.from({ length: 10 }, () => "N-004"),
        ...Array.from({ length: 10 }, () => "N-013"), // wrong color
        ...Array.from({ length: 5 }, () => "NOPE"), // unknown
      ],
    };
    expect(isLegalDeck(broken)).toBe(false);
    const repaired = repairDeck(broken);
    expect(isLegalDeck(repaired)).toBe(true);
  });
});
