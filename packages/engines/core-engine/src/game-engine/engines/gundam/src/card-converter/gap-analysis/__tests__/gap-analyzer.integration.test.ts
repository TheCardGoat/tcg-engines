/**
 * Integration tests for GapAnalyzer
 */

import { describe, expect, it } from "bun:test";
import { GapAnalyzer } from "../gap-analyzer";

describe("GapAnalyzer Integration", () => {
  const analyzer = new GapAnalyzer();

  describe("runCompleteAnalysis", () => {
    it("should run complete analysis workflow", async () => {
      // Use actual import files from the project
      const importFiles = [
        "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st01.json",
        "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st02.json",
      ];

      const typesFile =
        "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/definitions/improved-card-types.ts";
      const rulesFile =
        "packages/engines/core-engine/src/game-engine/engines/gundam/RULES.md";

      const report = await analyzer.runCompleteAnalysis(
        importFiles,
        typesFile,
        rulesFile,
      );

      // Verify report structure
      expect(report).toHaveProperty("importAnalysis");
      expect(report).toHaveProperty("typeAnalysis");
      expect(report).toHaveProperty("rulesAnalysis");
      expect(report).toHaveProperty("gaps");
      expect(report).toHaveProperty("recommendations");
      expect(report).toHaveProperty("priority");

      // Verify import analysis has data
      expect(report.importAnalysis.totalCards).toBeGreaterThan(0);
      expect(
        Object.keys(report.importAnalysis.fieldUsage).length,
      ).toBeGreaterThan(0);

      // Verify type analysis found types
      expect(report.typeAnalysis.definedTypes.length).toBeGreaterThan(0);

      // Verify rules analysis found game mechanics
      expect(report.rulesAnalysis.timingKeywords.length).toBeGreaterThan(0);
      expect(report.rulesAnalysis.keywordEffects.length).toBeGreaterThan(0);

      // Verify gaps were identified
      const totalGaps =
        report.gaps.missingFields.length +
        report.gaps.missingAbilities.length +
        report.gaps.missingEffects.length;
      expect(totalGaps).toBeGreaterThan(0);

      // Verify recommendations were generated
      expect(report.recommendations.length).toBeGreaterThan(0);

      console.log("Gap Analysis Report Summary:");
      console.log(
        `- Total cards analyzed: ${report.importAnalysis.totalCards}`,
      );
      console.log(
        `- Defined types found: ${report.typeAnalysis.definedTypes.length}`,
      );
      console.log(
        `- Timing keywords found: ${report.rulesAnalysis.timingKeywords.length}`,
      );
      console.log(
        `- Keyword effects found: ${report.rulesAnalysis.keywordEffects.length}`,
      );
      console.log(`- Missing fields: ${report.gaps.missingFields.length}`);
      console.log(
        `- Missing abilities: ${report.gaps.missingAbilities.length}`,
      );
      console.log(`- Missing effects: ${report.gaps.missingEffects.length}`);
      console.log(`- Priority: ${report.priority}`);
      console.log(`- Recommendations: ${report.recommendations.length}`);
    });

    it("should handle missing files gracefully", async () => {
      // Create a new analyzer instance to avoid cache issues
      const freshAnalyzer = new GapAnalyzer();

      const importFiles = ["nonexistent1.json", "nonexistent2.json"];
      const typesFile = "nonexistent-types.ts";
      const rulesFile = "nonexistent-rules.md";

      const report = await freshAnalyzer.runCompleteAnalysis(
        importFiles,
        typesFile,
        rulesFile,
      );

      // Should still generate a report, even with empty data
      expect(report).toHaveProperty("importAnalysis");
      expect(report).toHaveProperty("typeAnalysis");
      expect(report).toHaveProperty("rulesAnalysis");

      // Import analysis should show no cards
      expect(report.importAnalysis.totalCards).toBe(0);

      // Type analysis should show no types
      expect(report.typeAnalysis.definedTypes.length).toBe(0);

      // Rules analysis should show no mechanics
      expect(report.rulesAnalysis.timingKeywords.length).toBe(0);
      expect(report.rulesAnalysis.keywordEffects.length).toBe(0);
    });
  });

  describe("validateAnalysis", () => {
    it("should validate complete analysis", async () => {
      const importFiles = [
        "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st01.json",
      ];

      const typesFile =
        "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/definitions/improved-card-types.ts";
      const rulesFile =
        "packages/engines/core-engine/src/game-engine/engines/gundam/RULES.md";

      // Run analysis first
      await analyzer.runCompleteAnalysis(importFiles, typesFile, rulesFile);

      // Then validate
      const validation = await analyzer.validateAnalysis();

      expect(validation).toHaveProperty("success");
      expect(validation).toHaveProperty("errors");
      expect(validation).toHaveProperty("warnings");

      if (validation.success.length > 0) {
        expect(validation.success[0]).toHaveProperty("importAnalysis");
        expect(validation.success[0]).toHaveProperty("typeAnalysis");
        expect(validation.success[0]).toHaveProperty("rulesAnalysis");
      }
    });
  });

  describe("getAnalysisStatus", () => {
    it("should track analysis progress", async () => {
      analyzer.clearCache();

      let status = analyzer.getAnalysisStatus();
      expect(status.readyForReport).toBe(false);
      expect(status.importAnalysisComplete).toBe(false);
      expect(status.typeAnalysisComplete).toBe(false);
      expect(status.rulesAnalysisComplete).toBe(false);

      // Run import analysis
      await analyzer.analyzeImportData([
        "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/imports/st01.json",
      ]);

      status = analyzer.getAnalysisStatus();
      expect(status.importAnalysisComplete).toBe(true);
      expect(status.readyForReport).toBe(false);

      // Run type analysis
      await analyzer.analyzeCurrentTypes(
        "packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/definitions/improved-card-types.ts",
      );

      status = analyzer.getAnalysisStatus();
      expect(status.typeAnalysisComplete).toBe(true);
      expect(status.readyForReport).toBe(false);

      // Run rules analysis
      await analyzer.analyzeGameRules(
        "packages/engines/core-engine/src/game-engine/engines/gundam/RULES.md",
      );

      status = analyzer.getAnalysisStatus();
      expect(status.rulesAnalysisComplete).toBe(true);
      expect(status.readyForReport).toBe(true);
    });
  });
});
