import { describe, expect, it } from "vitest";

import { CARDS, getAllCards, getCardById } from "../src/index";
import type { CardType, Color, Rarity } from "../src/index";

const CARD_TYPES: readonly CardType[] = ["leader", "character", "ex_character", "chakra", "summon"];
const COLORS: readonly Color[] = ["red", "blue", "green", ""];
const RARITIES: readonly Rarity[] = ["L", "SR", "R", "C", "SB", ""];

describe("card data integrity", () => {
  it("contains exactly 35 cards with unique ids", () => {
    expect(CARDS).toHaveLength(35);
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(CARDS.length);
  });

  it("every card has non-empty identity fields and valid enums", () => {
    for (const card of CARDS) {
      expect(card.id.length).toBeGreaterThan(0);
      expect(card.set.length).toBeGreaterThan(0);
      expect(card.nameEn.length).toBeGreaterThan(0);
      expect(card.nameFr.length).toBeGreaterThan(0);
      // Japanese names are only published for playable cards (not utility cards).
      if (card.cardType !== "chakra" && card.cardType !== "summon") {
        expect(card.nameJa.length).toBeGreaterThan(0);
      }
      expect(CARD_TYPES).toContain(card.cardType);
      expect(COLORS).toContain(card.color);
      expect(RARITIES).toContain(card.rarity);
      // Artist is empty for cards whose illustrator is not yet published.
      expect(typeof card.artist).toBe("string");
      expect(typeof card.notForSale).toBe("boolean");
    }
  });

  it("leaders have life, damage and power (and no health)", () => {
    const leaders = CARDS.filter((c) => c.cardType === "leader");
    expect(leaders.length).toBeGreaterThan(0);
    for (const card of leaders) {
      expect(card.life).not.toBeNull();
      expect(card.damage).not.toBeNull();
      expect(card.power).not.toBeNull();
      expect(card.health).toBeNull();
    }
  });

  it("characters and EX characters have power, health and damage (and no life)", () => {
    const characters = CARDS.filter(
      (c) => c.cardType === "character" || c.cardType === "ex_character",
    );
    expect(characters.length).toBeGreaterThan(0);
    for (const card of characters) {
      expect(card.power).not.toBeNull();
      expect(card.health).not.toBeNull();
      expect(card.damage).not.toBeNull();
      expect(card.life).toBeNull();
    }
  });

  it("chakra and summon cards are well-formed (no stats, no support, no traits)", () => {
    const utility = CARDS.filter((c) => c.cardType === "chakra" || c.cardType === "summon");
    expect(utility.length).toBeGreaterThan(0);
    for (const card of utility) {
      expect(card.power).toBeNull();
      expect(card.health).toBeNull();
      expect(card.damage).toBeNull();
      expect(card.life).toBeNull();
      expect(card.color).toBe("");
      expect(card.support).toBeNull();
      expect(card.traits).toHaveLength(0);
    }
  });

  it("every skill has non-empty text and an array of labels", () => {
    for (const card of CARDS) {
      for (const skill of card.skills) {
        expect(skill.text.trim().length).toBeGreaterThan(0);
        expect(Array.isArray(skill.labels)).toBe(true);
      }
    }
  });

  it("every support has name, text, timing and a valid cost", () => {
    const withSupport = CARDS.filter((c) => c.support !== null);
    expect(withSupport.length).toBeGreaterThan(0);
    for (const card of withSupport) {
      const support = card.support;
      if (!support) throw new Error("unreachable");
      expect(support.name.trim().length).toBeGreaterThan(0);
      expect(support.text.trim().length).toBeGreaterThan(0);
      expect(support.timing.trim().length).toBeGreaterThan(0);
      if (support.cost !== null) {
        expect(Number.isInteger(support.cost)).toBe(true);
        expect(support.cost).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("image paths point at the (unshipped) /images/cards/en/ directory", () => {
    for (const card of CARDS) {
      expect(card.image).toMatch(/^\/images\/cards\/en\//);
    }
  });

  it("repository accessors are consistent with the data", () => {
    expect(getAllCards()).toHaveLength(CARDS.length);
    for (const card of CARDS) {
      expect(getCardById(card.id)).toBe(card);
    }
    expect(getCardById("DOES-NOT-EXIST")).toBeUndefined();
  });
});
