import { describe, expect, it } from "bun:test";
import {
  getCardsByColor,
  getCardsByCost,
  getCardsByHP,
  getCardsByKeyword,
  getCardsBySet,
  getCardsByType,
  getRandomCard,
  getUnitsByAP,
} from "./card-catalog-index";

describe("Card Catalog Index", () => {
  describe("getCardsBySet", () => {
    it("should return cards from ST01 set", () => {
      const st01Cards = getCardsBySet("ST01");

      expect(st01Cards.length).toBeGreaterThan(0);
      expect(st01Cards.every((card) => card.set === "ST01")).toBe(true);
    });

    it("should return cards from GD01 set", () => {
      const gd01Cards = getCardsBySet("GD01");

      expect(gd01Cards.length).toBeGreaterThan(0);
      expect(gd01Cards.every((card) => card.set === "GD01")).toBe(true);
    });

    it("should return empty array for non-existent set", () => {
      const cards = getCardsBySet("INVALID");

      expect(cards.length).toBe(0);
    });
  });

  describe("getCardsByType", () => {
    it("should return only unit cards", () => {
      const units = getCardsByType("unit");

      expect(units.length).toBeGreaterThan(0);
      expect(units.every((card) => card.type === "unit")).toBe(true);
    });

    it("should return only pilot cards", () => {
      const pilots = getCardsByType("pilot");

      expect(pilots.length).toBeGreaterThan(0);
      expect(pilots.every((card) => card.type === "pilot")).toBe(true);
    });

    it("should return only command cards", () => {
      const commands = getCardsByType("command");

      expect(commands.length).toBeGreaterThan(0);
      expect(commands.every((card) => card.type === "command")).toBe(true);
    });

    it("should return only base cards", () => {
      const bases = getCardsByType("base");

      expect(bases.length).toBeGreaterThan(0);
      expect(bases.every((card) => card.type === "base")).toBe(true);
    });
  });

  describe("getCardsByColor", () => {
    it("should return blue cards (excluding resource cards)", () => {
      const blueCards = getCardsByColor("blue");

      expect(blueCards.length).toBeGreaterThan(0);
      expect(
        blueCards.every(
          (card) =>
            card.type !== "resource" &&
            "color" in card &&
            card.color === "blue",
        ),
      ).toBe(true);
    });

    it("should return white cards (excluding resource cards)", () => {
      const whiteCards = getCardsByColor("white");

      expect(whiteCards.length).toBeGreaterThan(0);
      expect(
        whiteCards.every(
          (card) =>
            card.type !== "resource" &&
            "color" in card &&
            card.color === "white",
        ),
      ).toBe(true);
    });
  });

  describe("getCardsByCost", () => {
    it("should return cards with cost 1", () => {
      const lowCostCards = getCardsByCost(1);

      expect(lowCostCards.length).toBeGreaterThan(0);
      expect(
        lowCostCards.every(
          (card) =>
            card.type !== "resource" && "cost" in card && card.cost === 1,
        ),
      ).toBe(true);
    });

    it("should return cards within cost range", () => {
      const midCostCards = getCardsByCost(2, 4);

      expect(midCostCards.length).toBeGreaterThan(0);
      expect(
        midCostCards.every(
          (card) =>
            card.type !== "resource" &&
            "cost" in card &&
            card.cost !== undefined &&
            card.cost >= 2 &&
            card.cost <= 4,
        ),
      ).toBe(true);
    });
  });

  describe("getUnitsByAP", () => {
    it("should return units with specific AP", () => {
      const units = getUnitsByAP(2);

      expect(units.length).toBeGreaterThan(0);
      expect(units.every((unit) => unit.type === "unit" && unit.ap === 2)).toBe(
        true,
      );
    });

    it("should return units within AP range", () => {
      const units = getUnitsByAP(1, 3);

      expect(units.length).toBeGreaterThan(0);
      expect(
        units.every(
          (unit) => unit.type === "unit" && unit.ap >= 1 && unit.ap <= 3,
        ),
      ).toBe(true);
    });
  });

  describe("getCardsByHP", () => {
    it("should return units with specific HP", () => {
      const units = getCardsByHP(4);

      expect(units.length).toBeGreaterThan(0);
      expect(units.every((unit) => unit.type === "unit" && unit.hp === 4)).toBe(
        true,
      );
    });

    it("should return units within HP range", () => {
      const units = getCardsByHP(2, 4);

      expect(units.length).toBeGreaterThan(0);
      expect(
        units.every(
          (unit) => unit.type === "unit" && unit.hp >= 2 && unit.hp <= 4,
        ),
      ).toBe(true);
    });
  });

  describe("getCardsByKeyword", () => {
    it("should return cards with Repair keyword", () => {
      const repairCards = getCardsByKeyword("repair");

      expect(repairCards.length).toBeGreaterThan(0);
      expect(
        repairCards.every(
          (card) =>
            "abilities" in card &&
            card.abilities?.some((ability) => ability.abilityType === "repair"),
        ),
      ).toBe(true);
    });

    it("should return cards with Blocker keyword", () => {
      const blockerCards = getCardsByKeyword("blocker");

      expect(blockerCards.length).toBeGreaterThan(0);
      expect(
        blockerCards.every(
          (card) =>
            "abilities" in card &&
            card.abilities?.some(
              (ability) => ability.abilityType === "blocker",
            ),
        ),
      ).toBe(true);
    });

    it("should return empty array for non-existent keyword", () => {
      const cards = getCardsByKeyword("invalid-keyword");

      expect(cards.length).toBe(0);
    });
  });

  describe("getRandomCard", () => {
    it("should return a random card from the catalog", () => {
      const card = getRandomCard();

      expect(card).toBeDefined();
      expect(card.id).toBeDefined();
      expect(card.type).toBeDefined();
    });

    it("should return a random card of specific type", () => {
      const unit = getRandomCard({ type: "unit" });

      expect(unit.type).toBe("unit");
    });

    it("should return a random card matching multiple criteria", () => {
      const card = getRandomCard({
        type: "unit",
        color: "blue",
      });

      expect(card.type).toBe("unit");
      expect("color" in card && card.color).toBe("blue");
    });
  });
});
