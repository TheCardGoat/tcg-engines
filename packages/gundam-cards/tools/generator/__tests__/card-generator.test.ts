/**
 * Tests for Card Generator
 */

import { describe, expect, it } from "bun:test";
import type { TriggeredEffect } from "@tcg/gundam-types";
import type { ParseResult } from "../../parser/text-parser";
import type { ScrapedCardData } from "../../scraper/card-scraper";
import {
  createCardDefinition,
  generateCardFile,
  generateFilename,
} from "../card-generator";

describe("Card Generator", () => {
  const mockScrapedUnit: ScrapedCardData = {
    cardNumber: "ST01-001",
    name: "RX-78-2 Gundam",
    cardType: "UNIT",
    rarity: "LR",
    level: "3",
    cost: "2",
    color: "Blue",
    ap: "5",
    hp: "6",
    zone: "Space Earth",
    trait: "(Earth Federation) (White Base)",
    link: "[Amuro Ray]",
    effectText: "<First Strike> 【Deploy】Search your deck for a Pilot.",
    sourceTitle: "Mobile Suit Gundam",
    imageUrl: "https://example.com/card.jpg",
  };

  const mockParsed: ParseResult = {
    keywords: [{ keyword: "First-Strike" }],
    abilities: [
      {
        id: "mock-effect",
        type: "TRIGGERED",
        timing: "DEPLOY",
        description: "【Deploy】Search your deck for a Pilot.",
        action: {
          type: "SEARCH",
          parameters: {
            filter: { cardType: "PILOT" },
            destination: "hand",
            count: 1,
          },
        },
      } as TriggeredEffect,
    ],
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
        cardType: "PILOT",
        ap: "+2",
        hp: "+1",
        zone: "",
        link: "",
      };

      const card = createCardDefinition(mockPilot, {
        keywords: [],
        abilities: [],
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
        name: "Resource",
        cardType: "RESOURCE",
        rarity: "C",
        effectText: "",
      };

      const card = createCardDefinition(mockResource, {
        keywords: [],
        abilities: [],
        warnings: [],
      });

      expect(card?.cardType).toBe("RESOURCE");
      expect(card?.name).toBe("Resource");
    });
  });

  describe("generateCardFile", () => {
    it("should generate valid TypeScript code", () => {
      const card = createCardDefinition(mockScrapedUnit, mockParsed);
      if (!card) throw new Error("Card creation failed");

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
      if (!card) throw new Error("Card creation failed");

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
      if (!specialCard) throw new Error("Card creation failed");

      const filename = generateFilename(specialCard);

      expect(filename).toBe("050-zaku-ii-commander-type.ts");
    });
  });
});
