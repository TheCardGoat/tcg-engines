/**
 * GapAnalyzer - Main orchestrator for gap analysis functionality
 */

import type {
  ConversionResult,
  GameRulesAnalysis,
  GapAnalysisReport,
  ImportDataAnalysis,
  TypeSystemAnalysis,
} from "../shared/types";
import { GameRulesAnalyzer } from "./game-rules-analyzer";
import { GapAnalysisReportGenerator } from "./gap-analysis-report-generator";
import { ImportDataAnalyzer } from "./import-data-analyzer";
import type { GapAnalyzer as IGapAnalyzer } from "./interfaces";
import { TypeSystemAnalyzer } from "./type-system-analyzer";

export class GapAnalyzer implements IGapAnalyzer {
  private importAnalyzer = new ImportDataAnalyzer();
  private typeAnalyzer = new TypeSystemAnalyzer();
  private rulesAnalyzer = new GameRulesAnalyzer();
  private reportGenerator = new GapAnalysisReportGenerator();

  private cachedImportAnalysis?: ImportDataAnalysis;
  private cachedTypeAnalysis?: TypeSystemAnalysis;
  private cachedRulesAnalysis?: GameRulesAnalysis;

  /**
   * Analyzes import data structure and patterns
   */
  async analyzeImportData(importFiles: string[]): Promise<ImportDataAnalysis> {
    if (!this.cachedImportAnalysis) {
      this.cachedImportAnalysis =
        await this.importAnalyzer.scanImportFiles(importFiles);
    }
    return this.cachedImportAnalysis;
  }

  /**
   * Analyzes current type system for gaps and improvements
   */
  async analyzeCurrentTypes(typesFile: string): Promise<TypeSystemAnalysis> {
    if (!this.cachedTypeAnalysis) {
      this.cachedTypeAnalysis =
        await this.typeAnalyzer.parseTypeDefinitions(typesFile);

      // If we have import analysis, identify gaps
      if (this.cachedImportAnalysis) {
        const gaps = this.typeAnalyzer.identifyTypeGaps(
          this.cachedImportAnalysis,
        );
        const recommendations =
          this.typeAnalyzer.generateTypeRecommendations(gaps);

        this.cachedTypeAnalysis = {
          ...this.cachedTypeAnalysis,
          missingFields: gaps
            .filter((g) => g.includes("Missing field"))
            .map((g) => g.split(":")[1]?.trim().split(" ")[0] || ""),
          recommendations,
        };
      }
    }
    return this.cachedTypeAnalysis;
  }

  /**
   * Analyzes game rules to identify missing mechanics
   */
  async analyzeGameRules(rulesFile: string): Promise<GameRulesAnalysis> {
    if (!this.cachedRulesAnalysis) {
      this.cachedRulesAnalysis =
        await this.rulesAnalyzer.parseGameRules(rulesFile);
    }
    return this.cachedRulesAnalysis;
  }

  /**
   * Generates comprehensive gap analysis report
   */
  async generateGapReport(): Promise<GapAnalysisReport> {
    if (
      !(
        this.cachedImportAnalysis &&
        this.cachedTypeAnalysis &&
        this.cachedRulesAnalysis
      )
    ) {
      throw new Error(
        "Must run all analyses before generating report. Call analyzeImportData, analyzeCurrentTypes, and analyzeGameRules first.",
      );
    }

    const report = this.reportGenerator.generateReport(
      this.cachedImportAnalysis,
      this.cachedTypeAnalysis,
      this.cachedRulesAnalysis,
    );

    // Generate recommendations
    const recommendations =
      this.reportGenerator.generateRecommendations(report);

    return {
      ...report,
      recommendations,
    };
  }

  /**
   * Validates analysis results
   */
  async validateAnalysis(): Promise<ConversionResult<GapAnalysisReport>> {
    const report = await this.generateGapReport();
    return this.reportGenerator.validateReport(report);
  }

  /**
   * Runs complete gap analysis workflow
   */
  async runCompleteAnalysis(
    importFiles: string[],
    typesFile: string,
    rulesFile: string,
  ): Promise<GapAnalysisReport> {
    // Run all analyses
    await this.analyzeImportData(importFiles);
    await this.analyzeCurrentTypes(typesFile);
    await this.analyzeGameRules(rulesFile);

    // Generate and return report
    return this.generateGapReport();
  }

  /**
   * Clears cached analysis results
   */
  clearCache(): void {
    this.cachedImportAnalysis = undefined;
    this.cachedTypeAnalysis = undefined;
    this.cachedRulesAnalysis = undefined;
  }

  /**
   * Gets current analysis status
   */
  getAnalysisStatus(): {
    importAnalysisComplete: boolean;
    typeAnalysisComplete: boolean;
    rulesAnalysisComplete: boolean;
    readyForReport: boolean;
  } {
    return {
      importAnalysisComplete: !!this.cachedImportAnalysis,
      typeAnalysisComplete: !!this.cachedTypeAnalysis,
      rulesAnalysisComplete: !!this.cachedRulesAnalysis,
      readyForReport: !!(
        this.cachedImportAnalysis &&
        this.cachedTypeAnalysis &&
        this.cachedRulesAnalysis
      ),
    };
  }
}
