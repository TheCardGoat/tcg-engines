/**
 * Tests for TypeSystemAnalyzer
 */

import { describe, expect, it } from "bun:test";
import type { ImportDataAnalysis } from "../../shared/types";
import { TypeSystemAnalyzer } from "../type-system-analyzer";

describe("TypeSystemAnalyzer", () => {
  const analyzer = new TypeSystemAnalyzer();

  const sampleTypeScript = `
export type AbilityTiming =
  | "main"
  | "action"
  | "deploy"
  | "attack";

export interface KeywordEffect {
  readonly keyword: "repair" | "breach" | "support";
  readonly value?: number;
}

export interface GundamCard {
  readonly id: string;
  readonly name: string;
  readonly cost: number;
  readonly abilities: CardAbility[];
}

export interface CardAbility {
  readonly timing: AbilityTiming;
  readonly effects: GameEffect[];
}
`;

  const mockImportAnalysis: ImportDataAnalysis = {
    totalCards: 100,
    fieldUsage: {
      id: {
        frequency: 100,
        percentage: 100,
        dataTypes: new Set(["string"]),
        sampleValues: ["ST01-001"],
        nullCount: 0,
        emptyCount: 0,
      },
      name: {
        frequency: 100,
        percentage: 100,
        dataTypes: new Set(["string"]),
        sampleValues: ["Gundam"],
        nullCount: 0,
        emptyCount: 0,
      },
      cost: {
        frequency: 100,
        percentage: 100,
        dataTypes: new Set(["string"]),
        sampleValues: ["3"],
        nullCount: 0,
        emptyCount: 0,
      },
      level: {
        frequency: 100,
        percentage: 100,
        dataTypes: new Set(["string"]),
        sampleValues: ["4"],
        nullCount: 0,
        emptyCount: 0,
      },
      cardType: {
        frequency: 100,
        percentage: 100,
        dataTypes: new Set(["string"]),
        sampleValues: ["UNIT"],
        nullCount: 0,
        emptyCount: 0,
      },
      effect: {
        frequency: 90,
        percentage: 90,
        dataTypes: new Set(["string"]),
        sampleValues: ["<Repair 2>"],
        nullCount: 10,
        emptyCount: 0,
      },
      zone: {
        frequency: 80,
        percentage: 80,
        dataTypes: new Set(["string"]),
        sampleValues: ["Space Earth"],
        nullCount: 20,
        emptyCount: 0,
      },
      trait: {
        frequency: 85,
        percentage: 85,
        dataTypes: new Set(["string"]),
        sampleValues: ["(Earth Federation)"],
        nullCount: 15,
        emptyCount: 0,
      },
      link: {
        frequency: 70,
        percentage: 70,
        dataTypes: new Set(["string"]),
        sampleValues: ["[Amuro Ray]"],
        nullCount: 30,
        emptyCount: 0,
      },
      ap: {
        frequency: 80,
        percentage: 80,
        dataTypes: new Set(["string"]),
        sampleValues: ["3"],
        nullCount: 20,
        emptyCount: 0,
      },
      hp: {
        frequency: 80,
        percentage: 80,
        dataTypes: new Set(["string"]),
        sampleValues: ["4"],
        nullCount: 20,
        emptyCount: 0,
      },
    },
    cardTypeDistribution: { UNIT: 60, PILOT: 25, COMMAND: 10, BASE: 5 },
    setDistribution: { st01: 50, st02: 30, gd01: 20 },
    uniqueValues: {
      cardType: new Set(["UNIT", "PILOT", "COMMAND", "BASE"]),
      color: new Set(["Blue", "Red", "Green", "Yellow"]),
      rarity: new Set(["LR", "R", "C"]),
    },
  };

  describe("extractCurrentTypes", () => {
    it("should extract type definitions from TypeScript source", () => {
      const types = analyzer.extractCurrentTypes(sampleTypeScript);

      expect(types).toContain("AbilityTiming");
      expect(types).toContain("KeywordEffect");
      expect(types).toContain("GundamCard");
      expect(types).toContain("CardAbility");
    });

    it("should handle empty source code", () => {
      const types = analyzer.extractCurrentTypes("");
      expect(types).toEqual([]);
    });

    it("should handle malformed TypeScript", () => {
      const malformedCode = "export type Broken = {";
      const types = analyzer.extractCurrentTypes(malformedCode);
      // Should not throw and return what it can parse
      expect(Array.isArray(types)).toBe(true);
    });
  });

  describe("identifyTypeGaps", () => {
    it("should identify missing fields from import analysis", () => {
      const currentTypes = ["AbilityTiming", "KeywordEffect", "GundamCard"];
      const gaps = analyzer.identifyTypeGaps(mockImportAnalysis);

      expect(gaps.length).toBeGreaterThan(0);
      expect(gaps).toContain("Missing field: level (used in 100% of cards)");
      expect(gaps).toContain("Missing field: cardType (used in 100% of cards)");
    });

    it("should identify missing card types", () => {
      const gaps = analyzer.identifyTypeGaps(mockImportAnalysis);

      expect(gaps.some((gap) => gap.includes("PILOT"))).toBe(true);
      expect(gaps.some((gap) => gap.includes("COMMAND"))).toBe(true);
      expect(gaps.some((gap) => gap.includes("BASE"))).toBe(true);
    });

    it("should prioritize high-frequency fields", () => {
      const gaps = analyzer.identifyTypeGaps(mockImportAnalysis);

      // Fields used in 100% of cards should be mentioned first
      const highPriorityGaps = gaps.filter((gap) => gap.includes("100%"));
      expect(highPriorityGaps.length).toBeGreaterThan(0);
    });
  });

  describe("generateTypeRecommendations", () => {
    it("should generate actionable recommendations", () => {
      const gaps = [
        "Missing field: level (used in 100% of cards)",
        "Missing card type: PILOT",
        "Field cost has mixed types: string, number",
      ];

      const recommendations = analyzer.generateTypeRecommendations(gaps);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty("typeName");
      expect(recommendations[0]).toHaveProperty("suggestedDefinition");
      expect(recommendations[0]).toHaveProperty("reason");
      expect(recommendations[0]).toHaveProperty("breakingChange");
    });

    it("should mark breaking changes appropriately", () => {
      const gaps = ["Field cost has mixed types: string, number"];
      const recommendations = analyzer.generateTypeRecommendations(gaps);

      const costRecommendation = recommendations.find((r) =>
        r.typeName.includes("cost"),
      );
      expect(costRecommendation?.breakingChange).toBe(true);
    });
  });

  describe("parseTypeDefinitions", () => {
    it("should parse type definitions from file", async () => {
      // Mock file reading by testing the core parsing logic
      const analysis = await analyzer.parseTypeDefinitions("mock-file.ts");

      expect(analysis).toHaveProperty("definedTypes");
      expect(analysis).toHaveProperty("missingFields");
      expect(analysis).toHaveProperty("incompleteTypes");
      expect(analysis).toHaveProperty("recommendations");
    });
  });
});
