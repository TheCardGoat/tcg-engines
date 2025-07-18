/**
 * Tests for GapAnalysisReportGenerator
 */

import { describe, expect, it } from "bun:test";
import type {
  GameRulesAnalysis,
  GapAnalysisReport,
  ImportDataAnalysis,
  TypeSystemAnalysis,
} from "../../shared/types";
import { GapAnalysisReportGenerator } from "../gap-analysis-report-generator";

describe("GapAnalysisReportGenerator", () => {
  const generator = new GapAnalysisReportGenerator();

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
        dataTypes: new Set(["string", "number"]),
        sampleValues: ["3", 4],
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
    },
    cardTypeDistribution: { UNIT: 60, PILOT: 25, COMMAND: 10, BASE: 5 },
    setDistribution: { st01: 50, st02: 30, gd01: 20 },
    uniqueValues: {
      cardType: new Set(["UNIT", "PILOT", "COMMAND", "BASE"]),
      color: new Set(["Blue", "Red", "Green"]),
    },
  };

  const mockTypeAnalysis: TypeSystemAnalysis = {
    definedTypes: ["GundamCard", "AbilityTiming", "KeywordEffect"],
    missingFields: ["level", "cardType", "zone"],
    incompleteTypes: ["Empty interface: SomeInterface"],
    recommendations: [
      {
        typeName: "Add level field",
        suggestedDefinition: "readonly level: number;",
        reason: "Missing field: level (used in 100% of cards)",
        breakingChange: false,
      },
    ],
  };

  const mockRulesAnalysis: GameRulesAnalysis = {
    timingKeywords: ["Main", "Action", "Deploy", "Attack"],
    keywordEffects: ["Repair", "Breach", "Support", "Blocker"],
    gameMechanics: ["battle damage", "shield destruction", "pilot pairing"],
    missingImplementations: ["Missing implementation for: pilot pairing"],
  };

  describe("generateReport", () => {
    it("should combine all analysis results into comprehensive report", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      expect(report).toHaveProperty("importAnalysis");
      expect(report).toHaveProperty("typeAnalysis");
      expect(report).toHaveProperty("rulesAnalysis");
      expect(report).toHaveProperty("gaps");
      expect(report).toHaveProperty("recommendations");
      expect(report).toHaveProperty("priority");

      expect(report.importAnalysis).toBe(mockImportAnalysis);
      expect(report.typeAnalysis).toBe(mockTypeAnalysis);
      expect(report.rulesAnalysis).toBe(mockRulesAnalysis);
    });

    it("should identify field gaps from import analysis", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      expect(report.gaps.missingFields.length).toBeGreaterThan(0);

      const costField = report.gaps.missingFields.find(
        (f) => f.fieldName === "cost",
      );
      expect(costField).toBeDefined();
      expect(costField?.impact).toBe("critical"); // 100% usage
    });

    it("should identify ability gaps from rules analysis", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      expect(report.gaps.missingAbilities.length).toBeGreaterThan(0);

      const timingAbilities = report.gaps.missingAbilities.filter((a) =>
        mockRulesAnalysis.timingKeywords.some((k) => a.abilityName.includes(k)),
      );
      expect(timingAbilities.length).toBeGreaterThan(0);
    });

    it("should identify effect gaps from keyword effects", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      expect(report.gaps.missingEffects.length).toBeGreaterThan(0);

      const keywordEffects = report.gaps.missingEffects.filter((e) =>
        mockRulesAnalysis.keywordEffects.some((k) => e.effectName.includes(k)),
      );
      expect(keywordEffects.length).toBeGreaterThan(0);
    });
  });

  describe("prioritizeGaps", () => {
    it("should prioritize gaps by impact and frequency", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      const prioritizedReport = generator.prioritizeGaps(report);

      // High frequency fields should be marked as critical
      const criticalFields = prioritizedReport.gaps.missingFields.filter(
        (f) => f.impact === "critical",
      );
      expect(criticalFields.length).toBeGreaterThan(0);

      // Fields with 100% usage should be critical
      const highUsageFields = criticalFields.filter(
        (f) => f.usage.percentage === 100,
      );
      expect(highUsageFields.length).toBeGreaterThan(0);
    });

    it("should set overall priority based on critical gaps", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      const prioritizedReport = generator.prioritizeGaps(report);

      // Should be high priority due to critical missing fields
      expect(prioritizedReport.priority).toBe("high");
    });
  });

  describe("generateRecommendations", () => {
    it("should generate actionable recommendations", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      const recommendations = generator.generateRecommendations(report);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toContain("Add missing field");
    });

    it("should prioritize critical recommendations first", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      const recommendations = generator.generateRecommendations(report);

      // First recommendations should be about critical fields
      expect(recommendations[0]).toContain("CRITICAL");
    });
  });

  describe("validateReport", () => {
    it("should validate report completeness", () => {
      const report = generator.generateReport(
        mockImportAnalysis,
        mockTypeAnalysis,
        mockRulesAnalysis,
      );

      const validation = generator.validateReport(report);

      expect(validation.success.length).toBe(1);
      expect(validation.success[0]).toBe(report);
      expect(validation.errors.length).toBe(0);
    });

    it("should identify incomplete reports", () => {
      const incompleteReport: GapAnalysisReport = {
        importAnalysis: mockImportAnalysis,
        typeAnalysis: mockTypeAnalysis,
        rulesAnalysis: mockRulesAnalysis,
        gaps: {
          missingFields: [],
          missingAbilities: [],
          missingEffects: [],
          typeImprovements: [],
        },
        recommendations: [],
        priority: "low",
      };

      const validation = generator.validateReport(incompleteReport);

      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0].message).toContain("No gaps identified");
    });
  });
});
