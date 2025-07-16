/**
 * GapAnalysisReportGenerator - Combines all analysis results into comprehensive reports
 */

import type {
  AbilityGap,
  ConversionResult,
  EffectGap,
  FieldGap,
  GameRulesAnalysis,
  GapAnalysisReport,
  ImportDataAnalysis,
  TypeImprovement,
  TypeSystemAnalysis,
} from "../shared/types";
import type { GapAnalysisReportGenerator as IGapAnalysisReportGenerator } from "./interfaces";

export class GapAnalysisReportGenerator implements IGapAnalysisReportGenerator {
  /**
   * Combines all analysis results into comprehensive report
   */
  generateReport(
    importAnalysis: ImportDataAnalysis,
    typeAnalysis: TypeSystemAnalysis,
    rulesAnalysis: GameRulesAnalysis,
  ): GapAnalysisReport {
    const missingFields = this.identifyFieldGaps(importAnalysis, typeAnalysis);
    const missingAbilities = this.identifyAbilityGaps(
      rulesAnalysis,
      typeAnalysis,
    );
    const missingEffects = this.identifyEffectGaps(rulesAnalysis, typeAnalysis);
    const typeImprovements = this.combineTypeImprovements(
      typeAnalysis,
      importAnalysis,
    );

    const report: GapAnalysisReport = {
      importAnalysis,
      typeAnalysis,
      rulesAnalysis,
      gaps: {
        missingFields,
        missingAbilities,
        missingEffects,
        typeImprovements,
      },
      recommendations: [],
      priority: "medium", // Will be updated by prioritizeGaps
    };

    return this.prioritizeGaps(report);
  }

  /**
   * Prioritizes gaps by impact and frequency
   */
  prioritizeGaps(report: GapAnalysisReport): GapAnalysisReport {
    // Prioritize field gaps by usage frequency
    const prioritizedFields = report.gaps.missingFields
      .map((field) => ({
        ...field,
        impact: this.calculateFieldImpact(field),
      }))
      .sort(
        (a, b) =>
          this.getImpactWeight(b.impact) - this.getImpactWeight(a.impact),
      );

    // Prioritize ability gaps by frequency and complexity
    const prioritizedAbilities = report.gaps.missingAbilities.sort((a, b) => {
      if (a.frequency !== b.frequency) {
        return b.frequency - a.frequency;
      }
      return (
        this.getComplexityWeight(a.complexity) -
        this.getComplexityWeight(b.complexity)
      );
    });

    // Prioritize effect gaps by frequency
    const prioritizedEffects = report.gaps.missingEffects.sort(
      (a, b) => b.frequency - a.frequency,
    );

    // Determine overall priority
    const criticalFields = prioritizedFields.filter(
      (f) => f.impact === "critical",
    ).length;
    const importantFields = prioritizedFields.filter(
      (f) => f.impact === "important",
    ).length;
    const highFrequencyAbilities = prioritizedAbilities.filter(
      (a) => a.frequency > 10,
    ).length;

    let priority: "high" | "medium" | "low" = "low";
    if (criticalFields > 0 || highFrequencyAbilities > 5) {
      priority = "high";
    } else if (importantFields > 0 || highFrequencyAbilities > 0) {
      priority = "medium";
    }

    return {
      ...report,
      gaps: {
        missingFields: prioritizedFields,
        missingAbilities: prioritizedAbilities,
        missingEffects: prioritizedEffects,
        typeImprovements: report.gaps.typeImprovements,
      },
      priority,
    };
  }

  /**
   * Generates actionable recommendations
   */
  generateRecommendations(report: GapAnalysisReport): string[] {
    const recommendations: string[] = [];

    // Critical field recommendations first
    const criticalFields = report.gaps.missingFields.filter(
      (f) => f.impact === "critical",
    );
    if (criticalFields.length > 0) {
      recommendations.push(
        `🚨 CRITICAL: Add missing fields used in 100% of cards: ${criticalFields.map((f) => f.fieldName).join(", ")}`,
      );
    }

    // Important field recommendations
    const importantFields = report.gaps.missingFields.filter(
      (f) => f.impact === "important",
    );
    if (importantFields.length > 0) {
      recommendations.push(
        `⚠️ IMPORTANT: Add missing fields used frequently: ${importantFields.map((f) => f.fieldName).join(", ")}`,
      );
    }

    // High-frequency ability recommendations
    const highFreqAbilities = report.gaps.missingAbilities.filter(
      (a) => a.frequency > 10,
    );
    if (highFreqAbilities.length > 0) {
      recommendations.push(
        `🔧 Implement high-frequency abilities: ${highFreqAbilities.map((a) => a.abilityName).join(", ")}`,
      );
    }

    // Keyword effect recommendations
    if (report.gaps.missingEffects.length > 0) {
      recommendations.push(
        `✨ Add keyword effects: ${report.gaps.missingEffects
          .slice(0, 5)
          .map((e) => e.effectName)
          .join(", ")}`,
      );
    }

    // Type improvement recommendations
    const breakingChanges = report.gaps.typeImprovements.filter(
      (t) => t.breakingChange,
    );
    const nonBreakingChanges = report.gaps.typeImprovements.filter(
      (t) => !t.breakingChange,
    );

    if (nonBreakingChanges.length > 0) {
      recommendations.push(
        `🔄 Safe type improvements: ${nonBreakingChanges
          .slice(0, 3)
          .map((t) => t.typeName)
          .join(", ")}`,
      );
    }

    if (breakingChanges.length > 0) {
      recommendations.push(
        `💥 Breaking changes needed: ${breakingChanges
          .slice(0, 3)
          .map((t) => t.typeName)
          .join(", ")}`,
      );
    }

    // Summary recommendation
    const totalGaps =
      report.gaps.missingFields.length +
      report.gaps.missingAbilities.length +
      report.gaps.missingEffects.length;

    if (totalGaps > 20) {
      recommendations.unshift(
        `📊 SUMMARY: ${totalGaps} gaps identified. Recommend phased implementation starting with critical fields.`,
      );
    }

    return recommendations;
  }

  /**
   * Validates report completeness and accuracy
   */
  validateReport(
    report: GapAnalysisReport,
  ): ConversionResult<GapAnalysisReport> {
    const errors: any[] = [];
    const warnings: string[] = [];

    // Check if report has meaningful gaps
    const totalGaps =
      report.gaps.missingFields.length +
      report.gaps.missingAbilities.length +
      report.gaps.missingEffects.length;

    if (totalGaps === 0) {
      errors.push({
        cardId: "gap-analysis",
        severity: "warning" as const,
        category: "gap-analysis" as const,
        message: "No gaps identified - this may indicate incomplete analysis",
        suggestion: "Review analysis parameters and input data",
      });
    }

    // Check if import analysis has data
    if (report.importAnalysis.totalCards === 0) {
      errors.push({
        cardId: "import-analysis",
        severity: "error" as const,
        category: "gap-analysis" as const,
        message: "Import analysis contains no cards",
        suggestion:
          "Verify import data files are accessible and contain valid data",
      });
    }

    // Check if type analysis found any types
    if (report.typeAnalysis.definedTypes.length === 0) {
      warnings.push(
        "Type analysis found no defined types - may indicate parsing issues",
      );
    }

    // Check if rules analysis found game mechanics
    if (
      report.rulesAnalysis.timingKeywords.length === 0 &&
      report.rulesAnalysis.keywordEffects.length === 0
    ) {
      warnings.push(
        "Rules analysis found no timing keywords or effects - may indicate parsing issues",
      );
    }

    return {
      success: errors.length === 0 ? [report] : [],
      errors,
      warnings,
    };
  }

  /**
   * Identifies field gaps from import analysis
   */
  private identifyFieldGaps(
    importAnalysis: ImportDataAnalysis,
    typeAnalysis: TypeSystemAnalysis,
  ): FieldGap[] {
    const gaps: FieldGap[] = [];

    for (const [fieldName, usage] of Object.entries(
      importAnalysis.fieldUsage,
    )) {
      // Check if field is missing from current types
      const isFieldMissing = typeAnalysis.missingFields.includes(fieldName);

      if (isFieldMissing || usage.percentage > 50) {
        // Include frequently used fields
        gaps.push({
          fieldName,
          usage,
          currentType: isFieldMissing ? undefined : "unknown",
          suggestedType: this.suggestFieldType(usage),
          impact: this.calculateFieldImpact({ fieldName, usage } as FieldGap),
        });
      }
    }

    return gaps;
  }

  /**
   * Identifies ability gaps from rules analysis
   */
  private identifyAbilityGaps(
    rulesAnalysis: GameRulesAnalysis,
    typeAnalysis: TypeSystemAnalysis,
  ): AbilityGap[] {
    const gaps: AbilityGap[] = [];

    // Add timing keyword abilities
    for (const keyword of rulesAnalysis.timingKeywords) {
      gaps.push({
        abilityName: `${keyword} timing ability`,
        frequency: 10, // Estimated frequency
        currentImplementation: typeAnalysis.definedTypes.includes(
          "AbilityTiming",
        )
          ? "partial"
          : undefined,
        suggestedImplementation: `Add "${keyword.toLowerCase()}" to AbilityTiming type`,
        complexity: "simple",
      });
    }

    // Add missing implementations
    for (const missing of rulesAnalysis.missingImplementations) {
      const mechanicName = missing.replace("Missing implementation for: ", "");
      gaps.push({
        abilityName: mechanicName,
        frequency: 5, // Estimated frequency
        currentImplementation: undefined,
        suggestedImplementation: `Implement ${mechanicName} ability system`,
        complexity: "complex",
      });
    }

    return gaps;
  }

  /**
   * Identifies effect gaps from keyword effects
   */
  private identifyEffectGaps(
    rulesAnalysis: GameRulesAnalysis,
    typeAnalysis: TypeSystemAnalysis,
  ): EffectGap[] {
    const gaps: EffectGap[] = [];

    for (const effect of rulesAnalysis.keywordEffects) {
      gaps.push({
        effectName: effect,
        frequency: 8, // Estimated frequency
        currentImplementation: typeAnalysis.definedTypes.includes(
          "KeywordEffect",
        )
          ? "partial"
          : undefined,
        suggestedImplementation: `Add "${effect.toLowerCase()}" to KeywordEffect type`,
        gameRuleReference: `See rules section for <${effect}> effect`,
      });
    }

    return gaps;
  }

  /**
   * Combines type improvements from various analyses
   */
  private combineTypeImprovements(
    typeAnalysis: TypeSystemAnalysis,
    importAnalysis: ImportDataAnalysis,
  ): TypeImprovement[] {
    const improvements: TypeImprovement[] = [...typeAnalysis.recommendations];

    // Add improvements based on import data patterns
    for (const [fieldName, usage] of Object.entries(
      importAnalysis.fieldUsage,
    )) {
      if (usage.dataTypes.size > 1) {
        improvements.push({
          typeName: `Standardize ${fieldName} type`,
          suggestedDefinition: `readonly ${fieldName}: ${this.suggestFieldType(usage)};`,
          reason: `Field has mixed types: ${Array.from(usage.dataTypes).join(", ")}`,
          breakingChange: true,
        });
      }
    }

    return improvements;
  }

  /**
   * Calculates impact level for a field gap
   */
  private calculateFieldImpact(
    field: FieldGap,
  ): "critical" | "important" | "minor" {
    if (field.usage.percentage >= 100) return "critical";
    if (field.usage.percentage >= 75) return "important";
    return "minor";
  }

  /**
   * Suggests appropriate TypeScript type for a field
   */
  private suggestFieldType(usage: any): string {
    if (usage.dataTypes.has("string") && usage.dataTypes.has("number")) {
      return "string | number";
    }
    if (usage.dataTypes.has("string")) return "string";
    if (usage.dataTypes.has("number")) return "number";
    if (usage.dataTypes.has("boolean")) return "boolean";
    if (usage.dataTypes.has("object")) return "object";
    return "unknown";
  }

  /**
   * Gets numeric weight for impact level
   */
  private getImpactWeight(impact: "critical" | "important" | "minor"): number {
    switch (impact) {
      case "critical":
        return 3;
      case "important":
        return 2;
      case "minor":
        return 1;
    }
  }

  /**
   * Gets numeric weight for complexity level
   */
  private getComplexityWeight(
    complexity: "simple" | "moderate" | "complex",
  ): number {
    switch (complexity) {
      case "simple":
        return 1;
      case "moderate":
        return 2;
      case "complex":
        return 3;
    }
  }
}
