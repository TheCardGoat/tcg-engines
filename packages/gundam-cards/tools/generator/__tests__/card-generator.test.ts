/**
 * Tests for Card Generator
 */

import { describe, expect, it } from "bun:test";
import type { BaseEffect } from "@tcg/gundam-types";
import type { ParseResult } from "../../parser/text-parser";
import type { ScrapedCardData } from "../../scraper/card-scraper";
import {
  createCardDefinition,
  generateCardFile,
  generateFilename,
} from "../card-generator";

describe("Card Generator", () => {
  const mockScrapedUnit: ScrapedCardData = {
    ap: "5",
    cardNumber: "ST01-001",
    cardType: "UNIT",
    color: "Blue",
    cost: "2",
    effectText: "<First Strike> 【Deploy】Search your deck for a Pilot.",
    hp: "6",
    imageUrl: "https://example.com/card.jpg",
    level: "3",
    link: "[Amuro Ray]",
    name: "RX-78-2 Gundam",
    rarity: "LR",
    sourceTitle: "Mobile Suit Gundam",
    trait: "(Earth Federation) (White Base)",
    zone: "Space Earth",
  };

  const mockParsed: ParseResult = {
    effects: [
      {
        id: "mock-effect",
        type: "TRIGGERED",
        timing: "DEPLOY",
        description: "【Deploy】Search your deck for a Pilot.",
        restrictions: [],
        action: {
          type: "SEARCH",
          destination: "hand",
          count: 1,
          filter: { cardType: "PILOT" },
        },
      } as BaseEffect,
    ],
    keywords: [{ keyword: "First-Strike" }],
    warnings: [],
  };

  describe("createCardDefinition", () => {
    it("should create unit card definition", () => {
      const card = createCardDefinition(mockScrapedUnit, mockParsed);

      expect(card).toBeDefined();
      expect(card?.cardType).toBe("UNIT");
      expect(card?.name).toBe("RX-78-2 Gundam");
      expect(card?.cardNumber).toBe("ST01-001");
      expect(card?.setCode).toBe("ST01");

      if (card?.cardType === "UNIT") {
        expect(card.ap).toBe(5);
        expect(card.hp).toBe(6);
        expect(card.zones).toEqual(["space", "earth"]);
        expect(card.traits).toContain("earth");
        expect(card.traits).toContain("federation");
        expect(card.linkRequirements).toContain("amuro-ray");
        expect(card.keywords).toHaveLength(1);
        expect(card.effects).toHaveLength(1);
      }
    });

    it("should create pilot card definition", () => {
      const mockPilot: ScrapedCardData = {
        ...mockScrapedUnit,
        ap: "+2",
        cardType: "PILOT",
        hp: "+1",
        link: "",
        zone: "",
      };

      const card = createCardDefinition(mockPilot, {
        effects: [],
        keywords: [],
        warnings: [],
      });

      expect(card?.cardType).toBe("PILOT");

      if (card?.cardType === "PILOT") {
        expect(card.apModifier).toBe(2);
        expect(card.hpModifier).toBe(1);
        expect(card.traits.length).toBeGreaterThan(0);
      }
    });

    it("should create resource card definition", () => {
      const mockResource: ScrapedCardData = {
        cardNumber: "ST01-100",
        cardType: "RESOURCE",
        effectText: "",
        name: "Resource",
        rarity: "C",
      };

      const card = createCardDefinition(mockResource, {
        effects: [],
        keywords: [],
        warnings: [],
      });

      expect(card?.cardType).toBe("RESOURCE");
      expect(card?.name).toBe("Resource");
    });
  });

  describe("generateCardFile", () => {
    it("should generate valid TypeScript code", () => {
      const card = createCardDefinition(mockScrapedUnit, mockParsed);
      if (!card) {throw new Error("Card creation failed");}

      const code = generateCardFile(card);

      expect(code).toContain("import type { UnitCardDefinition }");
      expect(code).toContain("export const Rx782Gundam");
      expect(code).toContain('cardType: "UNIT"');
      expect(code).toContain('name: "RX-78-2 Gundam"');
      expect(code).toContain("ap: 5");
      expect(code).toContain("hp: 6");
    });
  });

  describe("generateFilename", () => {
    it("should generate kebab-case filename with card number", () => {
      const card = createCardDefinition(mockScrapedUnit, mockParsed);
      if (!card) {throw new Error("Card creation failed");}

      const filename = generateFilename(card);

      expect(filename).toBe("001-rx-78-2-gundam.ts");
    });

    it("should handle special characters in card name", () => {
      const specialCard = createCardDefinition(
        {
          ...mockScrapedUnit,
          cardNumber: "ST01-050",
          name: "Zaku II (Commander Type)",
        },
        mockParsed,
      );
      if (!specialCard) {throw new Error("Card creation failed");}

      const filename = generateFilename(specialCard);

      expect(filename).toBe("050-zaku-ii-commander-type.ts");
    });
  });
});
