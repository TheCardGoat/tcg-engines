/**
 * GameRulesAnalyzer - Parses RULES.md and extracts game mechanics
 */

import { readFile } from "node:fs/promises";
import type { GameRulesAnalysis } from "../shared/types";
import type { GameRulesAnalyzer as IGameRulesAnalyzer } from "./interfaces";

export class GameRulesAnalyzer implements IGameRulesAnalyzer {
  /**
   * Parses RULES.md and extracts game mechanics
   */
  async parseGameRules(rulesFile: string): Promise<GameRulesAnalysis> {
    try {
      const rulesText = await readFile(rulesFile, "utf-8");

      const timingKeywords = this.extractTimingKeywords(rulesText);
      const keywordEffects = this.extractKeywordEffects(rulesText);
      const gameMechanics = this.identifyGameMechanics(rulesText);
      const missingImplementations = this.findMissingImplementations(
        [...timingKeywords, ...keywordEffects, ...gameMechanics],
        [], // Would be populated with current type analysis
      );

      return {
        timingKeywords,
        keywordEffects,
        gameMechanics,
        missingImplementations,
      };
    } catch (error) {
      return {
        timingKeywords: [],
        keywordEffects: [],
        gameMechanics: [],
        missingImplementations: [],
      };
    }
  }

  /**
   * Extracts timing keywords from rules text
   */
  extractTimingKeywords(rulesText: string): string[] {
    const keywords = new Set<string>();

    // Extract Japanese-style timing markers 【keyword】
    const timingRegex = /【([^】]+)】/g;
    let match;
    while ((match = timingRegex.exec(rulesText)) !== null) {
      const keyword = match[1].trim();
      if (keyword) {
        keywords.add(keyword);
      }
    }

    return Array.from(keywords).sort();
  }

  /**
   * Extracts keyword effects from rules text
   */
  extractKeywordEffects(rulesText: string): string[] {
    const effects = new Set<string>();

    // Extract angle bracket keyword effects <Effect>
    const effectRegex = /<([^>]+)>/g;
    let match;
    while ((match = effectRegex.exec(rulesText)) !== null) {
      const effect = match[1].trim();
      // Filter out HTML-like tags and only keep game effects
      if (effect && !effect.includes(" ") && !effect.includes("/")) {
        effects.add(effect);
      }
    }

    return Array.from(effects).sort();
  }

  /**
   * Identifies game mechanics that need type representation
   */
  identifyGameMechanics(rulesText: string): string[] {
    const mechanics: string[] = [];

    // Define patterns for common game mechanics
    const mechanicPatterns = [
      // Battle and combat mechanics
      /battle damage/gi,
      /attack.*damage/gi,
      /shield.*destruct/gi,
      /shield.*area/gi,
      /block.*attack/gi,

      // Card interaction mechanics
      /pilot.*pair/gi,
      /unit.*pair/gi,
      /card.*play/gi,
      /effect.*activ/gi,

      // Resource and cost mechanics
      /resource.*area/gi,
      /cost.*pay/gi,
      /resource.*generat/gi,

      // Turn structure mechanics
      /turn.*phase/gi,
      /main.*phase/gi,
      /action.*step/gi,
      /end.*phase/gi,

      // Zone and location mechanics
      /battle.*area/gi,
      /trash.*area/gi,
      /deck.*area/gi,
      /hand.*area/gi,

      // State mechanics
      /rest.*unit/gi,
      /ready.*unit/gi,
      /destroy.*unit/gi,
      /hp.*recover/gi,
      /ap.*modif/gi,
    ];

    for (const pattern of mechanicPatterns) {
      const matches = rulesText.match(pattern);
      if (matches) {
        // Add unique matches
        const uniqueMatches = [...new Set(matches.map((m) => m.toLowerCase()))];
        mechanics.push(...uniqueMatches);
      }
    }

    // Extract specific game concepts from section headers
    const sectionRegex = /^#+\s*(.+)$/gm;
    let match;
    while ((match = sectionRegex.exec(rulesText)) !== null) {
      const section = match[1].trim().toLowerCase();
      if (
        section.includes("effect") ||
        section.includes("mechanic") ||
        section.includes("rule") ||
        section.includes("phase") ||
        section.includes("step")
      ) {
        mechanics.push(section);
      }
    }

    return [...new Set(mechanics)].sort();
  }

  /**
   * Finds missing implementations in current type system
   */
  findMissingImplementations(
    mechanics: string[],
    currentTypes: string[],
  ): string[] {
    const missing: string[] = [];
    const currentTypesLower = currentTypes.map((t) => t.toLowerCase());

    for (const mechanic of mechanics) {
      const mechanicLower = mechanic.toLowerCase();

      // Check if any current type relates to this mechanic
      const hasImplementation = currentTypesLower.some((type) => {
        // Simple keyword matching
        const mechanicWords = mechanicLower.split(/\s+/);
        const typeWords = type.split(/(?=[A-Z])/).map((w) => w.toLowerCase());

        return mechanicWords.some((mWord) =>
          typeWords.some(
            (tWord) => tWord.includes(mWord) || mWord.includes(tWord),
          ),
        );
      });

      if (!hasImplementation) {
        missing.push(`Missing implementation for: ${mechanic}`);
      }
    }

    return missing;
  }

  /**
   * Extracts specific rule sections for detailed analysis
   */
  private extractRuleSections(rulesText: string): Record<string, string> {
    const sections: Record<string, string> = {};

    // Split by major section headers
    const sectionRegex = /^#+\s*(.+)$/gm;
    const matches = [...rulesText.matchAll(sectionRegex)];

    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const nextMatch = matches[i + 1];

      const sectionName = currentMatch[1].trim();
      const startIndex = currentMatch.index! + currentMatch[0].length;
      const endIndex = nextMatch ? nextMatch.index! : rulesText.length;

      const sectionContent = rulesText.slice(startIndex, endIndex).trim();
      sections[sectionName] = sectionContent;
    }

    return sections;
  }

  /**
   * Analyzes specific timing patterns in rules
   */
  private analyzeTimingPatterns(rulesText: string): string[] {
    const patterns: string[] = [];

    // Look for timing-related phrases
    const timingPhrases = [
      /during.*phase/gi,
      /at.*end.*turn/gi,
      /when.*attack/gi,
      /when.*destroy/gi,
      /when.*play/gi,
      /before.*battle/gi,
      /after.*battle/gi,
    ];

    for (const pattern of timingPhrases) {
      const matches = rulesText.match(pattern);
      if (matches) {
        patterns.push(...matches.map((m) => m.toLowerCase()));
      }
    }

    return [...new Set(patterns)];
  }

  /**
   * Extracts numerical values and ranges from rules
   */
  private extractNumericalConcepts(rulesText: string): string[] {
    const concepts: string[] = [];

    // Look for numerical concepts
    const numericalPatterns = [
      /\d+\s*damage/gi,
      /\d+\s*hp/gi,
      /\d+\s*ap/gi,
      /\d+\s*cost/gi,
      /\d+\s*or\s*more/gi,
      /\d+\s*or\s*less/gi,
    ];

    for (const pattern of numericalPatterns) {
      const matches = rulesText.match(pattern);
      if (matches) {
        concepts.push(...matches.map((m) => m.toLowerCase()));
      }
    }

    return [...new Set(concepts)];
  }
}
