/**
 * Tests for ImportDataAnalyzer
 */

import { describe, expect, it } from "bun:test";
import type { ExternalCardData } from "../../../cards/import-converter";
import { ImportDataAnalyzer } from "../import-data-analyzer";

describe("ImportDataAnalyzer", () => {
  const analyzer = new ImportDataAnalyzer();

  const sampleCards: ExternalCardData[] = [
    {
      id: "ST01-001",
      code: "ST01-001",
      rarity: "LR",
      name: "Gundam",
      level: "4",
      cost: "3",
      color: "Blue",
      cardType: "UNIT",
      effect:
        "&lt;Repair 2&gt; (At the end of your turn, this Unit recovers the specified number of HP.)<br>【During Pair】During your turn, all your Units get AP+1.<br>",
      zone: "Space Earth",
      trait: "(Earth Federation) (White Base Team)",
      link: "[Amuro Ray]",
      ap: "3",
      hp: "4",
      sourceTitle: "Mobile Suit Gundam",
      getIt: "Heroic Beginnings [ST01]",
      set: { id: "st01", name: "Heroic Beginnings [ST01]" },
      images: {
        small: "https://example.com/small.webp",
        large: "https://example.com/large.webp",
      },
    },
    {
      id: "ST01-002",
      code: "ST01-002",
      rarity: "R",
      name: "Guncannon",
      level: "3",
      cost: "2",
      color: "Blue",
      cardType: "UNIT",
      effect:
        "&lt;Support&gt; (When this Unit is paired with a Pilot, it gets AP+1.)<br>",
      zone: "Earth",
      trait: "(Earth Federation)",
      link: "[Kai Shiden]",
      ap: "2",
      hp: "3",
      sourceTitle: "Mobile Suit Gundam",
      getIt: "Heroic Beginnings [ST01]",
      set: { id: "st01", name: "Heroic Beginnings [ST01]" },
      images: {
        small: "https://example.com/small2.webp",
        large: "https://example.com/large2.webp",
      },
    },
  ];

  describe("analyzeFieldUsage", () => {
    it("should analyze field frequency and data types", () => {
      const result = analyzer.analyzeFieldUsage(sampleCards);

      expect(result.length).toBeGreaterThan(10); // Should find multiple fields including nested ones

      const idField = result.find((field) => field.fieldName === "id");
      expect(idField).toBeDefined();
      expect(idField?.frequency).toBe(2);
      expect(idField?.percentage).toBe(100);
      expect(idField?.dataTypes.has("string")).toBe(true);
      expect(idField?.nullCount).toBe(0);
    });

    it("should detect different data types for the same field", () => {
      const mixedTypeCards: ExternalCardData[] = [
        { ...sampleCards[0], level: "4" },
        { ...sampleCards[1], level: 3 as any }, // Mixed string/number
      ];

      const result = analyzer.analyzeFieldUsage(mixedTypeCards);
      const levelField = result.find((field) => field.fieldName === "level");

      expect(levelField?.dataTypes.has("string")).toBe(true);
      expect(levelField?.dataTypes.has("number")).toBe(true);
    });

    it("should count null and empty values", () => {
      const cardsWithNulls: ExternalCardData[] = [
        { ...sampleCards[0], trait: null as any },
        { ...sampleCards[1], trait: "" },
      ];

      const result = analyzer.analyzeFieldUsage(cardsWithNulls);
      const traitField = result.find((field) => field.fieldName === "trait");

      expect(traitField?.nullCount).toBe(1);
      expect(traitField?.emptyCount).toBe(1);
    });
  });

  describe("detectDataTypes", () => {
    it("should detect string types", () => {
      const values = ["test", "another string", ""];
      const types = analyzer.detectDataTypes(values);
      expect(types.has("string")).toBe(true);
    });

    it("should detect number types", () => {
      const values = [1, 2.5, 0];
      const types = analyzer.detectDataTypes(values);
      expect(types.has("number")).toBe(true);
    });

    it("should detect object types", () => {
      const values = [{ id: "test" }, { name: "example" }];
      const types = analyzer.detectDataTypes(values);
      expect(types.has("object")).toBe(true);
    });

    it("should detect null and undefined", () => {
      const values = [null, undefined, "test"];
      const types = analyzer.detectDataTypes(values);
      expect(types.has("null")).toBe(true);
      expect(types.has("undefined")).toBe(true);
      expect(types.has("string")).toBe(true);
    });
  });

  describe("catalogUniqueValues", () => {
    it("should catalog unique values for each field", () => {
      const result = analyzer.catalogUniqueValues(sampleCards);

      expect(result.cardType.has("UNIT")).toBe(true);
      expect(result.color.has("Blue")).toBe(true);
      expect(result.rarity.has("LR")).toBe(true);
      expect(result.rarity.has("R")).toBe(true);
    });

    it("should handle nested object fields", () => {
      const result = analyzer.catalogUniqueValues(sampleCards);

      expect(result["set.id"].has("st01")).toBe(true);
      expect(result["set.name"].has("Heroic Beginnings [ST01]")).toBe(true);
    });
  });

  describe("scanImportFiles", () => {
    it("should scan import files and return analysis", async () => {
      // This test would require actual file system interaction
      // For now, we'll test the structure
      const mockFilePaths = ["test1.json", "test2.json"];

      // Mock the file reading to return our sample data
      const result = await analyzer.scanImportFiles(mockFilePaths);

      expect(result).toHaveProperty("totalCards");
      expect(result).toHaveProperty("fieldUsage");
      expect(result).toHaveProperty("cardTypeDistribution");
      expect(result).toHaveProperty("setDistribution");
      expect(result).toHaveProperty("uniqueValues");
    });
  });
});
