/**
 * TypeSystemAnalyzer - Analyzes current type system for gaps and improvements
 */

import { readFile } from "node:fs/promises";
import type {
  ImportDataAnalysis,
  TypeImprovement,
  TypeSystemAnalysis,
} from "../shared/types";
import type { TypeSystemAnalyzer as ITypeSystemAnalyzer } from "./interfaces";

export class TypeSystemAnalyzer implements ITypeSystemAnalyzer {
  /**
   * Parses existing type definitions from a TypeScript file
   */
  async parseTypeDefinitions(typesFile: string): Promise<TypeSystemAnalysis> {
    try {
      const sourceCode = await readFile(typesFile, "utf-8");
      const definedTypes = this.extractCurrentTypes(sourceCode);

      return {
        definedTypes,
        missingFields: [], // Will be populated when compared with import analysis
        incompleteTypes: this.findIncompleteTypes(sourceCode),
        recommendations: [],
      };
    } catch (error) {
      console.warn(`Failed to read types file ${typesFile}:`, error);
      return {
        definedTypes: [],
        missingFields: [],
        incompleteTypes: [],
        recommendations: [],
      };
    }
  }

  /**
   * Extracts current type definitions using basic AST parsing
   */
  extractCurrentTypes(sourceCode: string): string[] {
    if (!sourceCode.trim()) return [];

    const types: string[] = [];

    try {
      // Extract type aliases (export type Name = ...)
      const typeAliasRegex = /export\s+type\s+(\w+)\s*=/g;
      let match;
      while ((match = typeAliasRegex.exec(sourceCode)) !== null) {
        types.push(match[1]);
      }

      // Extract interfaces (export interface Name ...)
      const interfaceRegex = /export\s+interface\s+(\w+)/g;
      while ((match = interfaceRegex.exec(sourceCode)) !== null) {
        types.push(match[1]);
      }

      // Extract enums (export enum Name ...)
      const enumRegex = /export\s+enum\s+(\w+)/g;
      while ((match = enumRegex.exec(sourceCode)) !== null) {
        types.push(match[1]);
      }

      // Extract classes (export class Name ...)
      const classRegex = /export\s+class\s+(\w+)/g;
      while ((match = classRegex.exec(sourceCode)) !== null) {
        types.push(match[1]);
      }
    } catch (error) {
      console.warn("Error parsing TypeScript source:", error);
    }

    return [...new Set(types)]; // Remove duplicates
  }

  /**
   * Identifies gaps in current type system based on import analysis
   */
  identifyTypeGaps(importAnalysis: ImportDataAnalysis): string[] {
    const gaps: string[] = [];

    // Check for missing fields based on usage frequency
    for (const [fieldName, usage] of Object.entries(
      importAnalysis.fieldUsage,
    )) {
      if (usage.frequency > 0) {
        gaps.push(
          `Missing field: ${fieldName} (used in ${usage.percentage}% of cards)`,
        );
      }

      // Check for mixed data types
      if (usage.dataTypes.size > 1) {
        const types = Array.from(usage.dataTypes).join(", ");
        gaps.push(`Field ${fieldName} has mixed types: ${types}`);
      }

      // Check for high null/empty rates
      if (usage.nullCount > 0 || usage.emptyCount > 0) {
        const totalIssues = usage.nullCount + usage.emptyCount;
        const issuePercentage = Math.round(
          (totalIssues / importAnalysis.totalCards) * 100,
        );
        if (issuePercentage > 10) {
          // More than 10% null/empty
          gaps.push(
            `Field ${fieldName} has ${issuePercentage}% null/empty values`,
          );
        }
      }
    }

    // Check for missing card types
    for (const cardType of Object.keys(importAnalysis.cardTypeDistribution)) {
      gaps.push(`Missing card type: ${cardType}`);
    }

    // Check for missing unique values that might need enum types
    for (const [fieldName, uniqueValues] of Object.entries(
      importAnalysis.uniqueValues,
    )) {
      if (uniqueValues.size <= 10 && uniqueValues.size > 1) {
        // Good candidate for enum
        gaps.push(
          `Field ${fieldName} could be enum: ${Array.from(uniqueValues).join(", ")}`,
        );
      }
    }

    return gaps;
  }

  /**
   * Generates type improvement recommendations
   */
  generateTypeRecommendations(gaps: string[]): TypeImprovement[] {
    const recommendations: TypeImprovement[] = [];

    for (const gap of gaps) {
      if (gap.includes("Missing field:")) {
        const fieldMatch = gap.match(/Missing field: (\w+)/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          recommendations.push({
            typeName: `Add ${fieldName} field`,
            suggestedDefinition: `readonly ${fieldName}: string;`,
            reason: gap,
            breakingChange: false,
          });
        }
      }

      if (gap.includes("mixed types:")) {
        const fieldMatch = gap.match(/Field (\w+) has mixed types:/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          recommendations.push({
            typeName: `Standardize ${fieldName} type`,
            suggestedDefinition: `readonly ${fieldName}: string | number;`,
            reason: gap,
            breakingChange: true,
          });
        }
      }

      if (gap.includes("Missing card type:")) {
        const typeMatch = gap.match(/Missing card type: (\w+)/);
        if (typeMatch) {
          const cardType = typeMatch[1];
          recommendations.push({
            typeName: `Add ${cardType} card type`,
            suggestedDefinition: `| "${cardType.toLowerCase()}"`,
            reason: gap,
            breakingChange: false,
          });
        }
      }

      if (gap.includes("could be enum:")) {
        const fieldMatch = gap.match(/Field (\w+) could be enum:/);
        const valuesMatch = gap.match(/enum: (.+)$/);
        if (fieldMatch && valuesMatch) {
          const fieldName = fieldMatch[1];
          const values = valuesMatch[1].split(", ");
          const enumValues = values.map((v) => `"${v}"`).join(" | ");
          recommendations.push({
            typeName: `Create ${fieldName} enum`,
            suggestedDefinition: `export type ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} = ${enumValues};`,
            reason: gap,
            breakingChange: false,
          });
        }
      }
    }

    return recommendations;
  }

  /**
   * Finds incomplete type definitions in the source code
   */
  private findIncompleteTypes(sourceCode: string): string[] {
    const incompleteTypes: string[] = [];

    // Look for TODO comments in type definitions
    const todoRegex = /\/\*\*?[^*]*TODO[^*]*\*+\/|\/\/.*TODO.*/gi;
    const todoMatches = sourceCode.match(todoRegex);
    if (todoMatches) {
      incompleteTypes.push(...todoMatches.map((match) => match.trim()));
    }

    // Look for any type definitions
    const anyTypeRegex = /:\s*any\b/g;
    const anyMatches = sourceCode.match(anyTypeRegex);
    if (anyMatches) {
      incompleteTypes.push(`Found ${anyMatches.length} uses of 'any' type`);
    }

    // Look for empty interfaces
    const emptyInterfaceRegex = /interface\s+(\w+)\s*\{\s*\}/g;
    let match;
    while ((match = emptyInterfaceRegex.exec(sourceCode)) !== null) {
      incompleteTypes.push(`Empty interface: ${match[1]}`);
    }

    return incompleteTypes;
  }
}
