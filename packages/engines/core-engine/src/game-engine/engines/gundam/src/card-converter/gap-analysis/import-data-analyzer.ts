/**
 * ImportDataAnalyzer - Analyzes JSON import files and catalogs field usage patterns
 */

import { readFile } from "node:fs/promises";
import { logger } from "~/shared/logger";
import type { ExternalCardData } from "../../cards/import-converter";
import type { FieldUsageInfo, ImportDataAnalysis } from "../shared/types";
import type { ImportDataAnalyzer as IImportDataAnalyzer } from "./interfaces";

export class ImportDataAnalyzer implements IImportDataAnalyzer {
  /**
   * Scans JSON files and catalogs field usage patterns
   */
  async scanImportFiles(filePaths: string[]): Promise<ImportDataAnalysis> {
    const allCards: ExternalCardData[] = [];

    // Read all import files
    for (const filePath of filePaths) {
      try {
        const fileContent = await readFile(filePath, "utf-8");
        const cards = JSON.parse(fileContent) as ExternalCardData[];
        allCards.push(...cards);
      } catch (error) {
        // logger.warn(`Failed to read import file ${filePath}:`, error);
      }
    }

    // Analyze the collected data
    const fieldUsage = this.analyzeFieldUsage(allCards);
    const cardTypeDistribution = this.getCardTypeDistribution(allCards);
    const setDistribution = this.getSetDistribution(allCards);
    const uniqueValues = this.catalogUniqueValues(allCards);

    return {
      totalCards: allCards.length,
      fieldUsage: this.convertFieldUsageToRecord(fieldUsage),
      cardTypeDistribution,
      setDistribution,
      uniqueValues,
    };
  }

  /**
   * Analyzes field frequency and data type patterns
   */
  analyzeFieldUsage(
    cards: ExternalCardData[],
  ): Array<FieldUsageInfo & { fieldName: string }> {
    if (cards.length === 0) return [];

    const fieldStats = new Map<
      string,
      {
        count: number;
        types: Set<string>;
        values: unknown[];
        nullCount: number;
        emptyCount: number;
      }
    >();

    // Collect field statistics
    for (const card of cards) {
      this.collectFieldStats(card, fieldStats, "");
    }

    // Convert to FieldUsageInfo format
    const result: Array<FieldUsageInfo & { fieldName: string }> = [];

    for (const [fieldName, stats] of fieldStats) {
      result.push({
        fieldName,
        frequency: stats.count,
        percentage: Math.round((stats.count / cards.length) * 100),
        dataTypes: stats.types,
        sampleValues: stats.values.slice(0, 5), // Keep first 5 as samples
        nullCount: stats.nullCount,
        emptyCount: stats.emptyCount,
      });
    }

    return result.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Detects data type patterns for each field
   */
  detectDataTypes(fieldValues: unknown[]): Set<string> {
    const types = new Set<string>();

    for (const value of fieldValues) {
      if (value === null) {
        types.add("null");
      } else if (value === undefined) {
        types.add("undefined");
      } else if (Array.isArray(value)) {
        types.add("array");
      } else {
        types.add(typeof value);
      }
    }

    return types;
  }

  /**
   * Identifies unique values and patterns
   */
  catalogUniqueValues(cards: ExternalCardData[]): Record<string, Set<string>> {
    const uniqueValues: Record<string, Set<string>> = {};

    for (const card of cards) {
      this.collectUniqueValues(card, uniqueValues, "");
    }

    return uniqueValues;
  }

  /**
   * Recursively collect field statistics from nested objects
   */
  private collectFieldStats(
    obj: any,
    fieldStats: Map<
      string,
      {
        count: number;
        types: Set<string>;
        values: unknown[];
        nullCount: number;
        emptyCount: number;
      }
    >,
    prefix: string,
  ): void {
    if (obj === null || obj === undefined) return;

    for (const [key, value] of Object.entries(obj)) {
      const fieldName = prefix ? `${prefix}.${key}` : key;

      if (!fieldStats.has(fieldName)) {
        fieldStats.set(fieldName, {
          count: 0,
          types: new Set(),
          values: [],
          nullCount: 0,
          emptyCount: 0,
        });
      }

      const stats = fieldStats.get(fieldName)!;
      stats.count++;
      stats.values.push(value);

      if (value === null) {
        stats.nullCount++;
        stats.types.add("null");
      } else if (value === undefined) {
        stats.types.add("undefined");
      } else if (value === "") {
        stats.emptyCount++;
        stats.types.add("string");
      } else if (Array.isArray(value)) {
        stats.types.add("array");
      } else if (typeof value === "object") {
        stats.types.add("object");
        // Recursively analyze nested objects
        this.collectFieldStats(value, fieldStats, fieldName);
      } else {
        stats.types.add(typeof value);
      }
    }
  }

  /**
   * Recursively collect unique values from nested objects
   */
  private collectUniqueValues(
    obj: any,
    uniqueValues: Record<string, Set<string>>,
    prefix: string,
  ): void {
    if (obj === null || obj === undefined) return;

    for (const [key, value] of Object.entries(obj)) {
      const fieldName = prefix ? `${prefix}.${key}` : key;

      if (!uniqueValues[fieldName]) {
        uniqueValues[fieldName] = new Set();
      }

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        uniqueValues[fieldName].add(String(value));
      } else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Recursively analyze nested objects
        this.collectUniqueValues(value, uniqueValues, fieldName);
      }
    }
  }

  /**
   * Get distribution of card types
   */
  private getCardTypeDistribution(
    cards: ExternalCardData[],
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    for (const card of cards) {
      const cardType = card.cardType || "unknown";
      distribution[cardType] = (distribution[cardType] || 0) + 1;
    }

    return distribution;
  }

  /**
   * Get distribution of card sets
   */
  private getSetDistribution(
    cards: ExternalCardData[],
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    for (const card of cards) {
      const setId = card.set?.id || "unknown";
      distribution[setId] = (distribution[setId] || 0) + 1;
    }

    return distribution;
  }

  /**
   * Convert field usage array to record format
   */
  private convertFieldUsageToRecord(
    fieldUsage: Array<FieldUsageInfo & { fieldName: string }>,
  ): Record<string, FieldUsageInfo> {
    const record: Record<string, FieldUsageInfo> = {};

    for (const field of fieldUsage) {
      const { fieldName, ...usageInfo } = field;
      record[fieldName] = usageInfo;
    }

    return record;
  }
}
