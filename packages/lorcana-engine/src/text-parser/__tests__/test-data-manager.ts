// Test data management system for organizing and maintaining parser test cases

import { SET008_ACTION_CARDS } from "./set008-action-cards";
import type { ActionCardTestCase } from "./test-data-extractor";

/**
 * Categories for organizing test cases
 */
export enum TestCategory {
  BASIC_DRAW = "basic-draw",
  BASIC_DAMAGE = "basic-damage",
  BASIC_BANISH = "basic-banish",
  BASIC_ATTRIBUTE = "basic-attribute",
  BASIC_MOVE = "basic-move",
  MODAL_EFFECTS = "modal-effects",
  CONDITIONAL_EFFECTS = "conditional-effects",
  TIMING_EFFECTS = "timing-effects",
  MULTI_EFFECT = "multi-effect",
  AREA_EFFECTS = "area-effects",
  COMPLEX_TARGETING = "complex-targeting",
  UNKNOWN_PATTERNS = "unknown-patterns",
  ERROR_CASES = "error-cases",
}

/**
 * Test case with category and priority information
 */
export interface CategorizedTestCase extends ActionCardTestCase {
  category: TestCategory;
  priority: number; // 1 = highest priority, 5 = lowest priority
  tags: string[];
  difficulty: "easy" | "medium" | "hard" | "expert";
}

/**
 * Test suite configuration
 */
export interface TestSuiteConfig {
  includeCategories?: TestCategory[];
  excludeCategories?: TestCategory[];
  maxPriority?: number;
  maxDifficulty?: "easy" | "medium" | "hard" | "expert";
  includeKnownFailures?: boolean;
  randomSeed?: number;
}

/**
 * Categorized test cases for set 008 action cards
 */
export const CATEGORIZED_TEST_CASES: CategorizedTestCase[] = [
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Candy Drift")!,
    category: TestCategory.MULTI_EFFECT,
    priority: 2,
    tags: ["draw", "attribute", "timing", "delayed-trigger"],
    difficulty: "hard",
  },
  {
    ...SET008_ACTION_CARDS.find(
      (card) => card.cardName === "Only So Much Room",
    )!,
    category: TestCategory.COMPLEX_TARGETING,
    priority: 3,
    tags: ["move", "conditional-targeting", "multiple-zones"],
    difficulty: "expert",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Pull The Lever!")!,
    category: TestCategory.MODAL_EFFECTS,
    priority: 1,
    tags: ["modal", "choice", "draw", "discard"],
    difficulty: "medium",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Forest Duel")!,
    category: TestCategory.CONDITIONAL_EFFECTS,
    priority: 2,
    tags: ["damage", "conditional", "draw"],
    difficulty: "hard",
  },
  {
    ...SET008_ACTION_CARDS.find(
      (card) => card.cardName === "Into the Unknown",
    )!,
    category: TestCategory.BASIC_DRAW,
    priority: 3,
    tags: ["scry", "deck-manipulation"],
    difficulty: "medium",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Wrong Lever!")!,
    category: TestCategory.AREA_EFFECTS,
    priority: 2,
    tags: ["discard", "draw", "all-players"],
    difficulty: "hard",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Undermine")!,
    category: TestCategory.BASIC_MOVE,
    priority: 1,
    tags: ["move", "return-to-hand", "item"],
    difficulty: "easy",
  },
  {
    ...SET008_ACTION_CARDS.find(
      (card) => card.cardName === "Nothing We Won't Do",
    )!,
    category: TestCategory.AREA_EFFECTS,
    priority: 1,
    tags: ["damage", "area", "opposing-characters"],
    difficulty: "medium",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Get Out!")!,
    category: TestCategory.MULTI_EFFECT,
    priority: 2,
    tags: ["move", "restriction", "return-to-hand"],
    difficulty: "hard",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Twitterpated")!,
    category: TestCategory.TIMING_EFFECTS,
    priority: 2,
    tags: ["restriction", "quest", "next-turn"],
    difficulty: "medium",
  },
  {
    ...SET008_ACTION_CARDS.find(
      (card) => card.cardName === "Most Everyone's Mad Here",
    )!,
    category: TestCategory.AREA_EFFECTS,
    priority: 1,
    tags: ["draw", "discard", "all-players"],
    difficulty: "medium",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Heads Held High")!,
    category: TestCategory.BASIC_ATTRIBUTE,
    priority: 1,
    tags: ["attribute", "lore", "all-characters", "duration"],
    difficulty: "easy",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Desperate Plan")!,
    category: TestCategory.MULTI_EFFECT,
    priority: 1,
    tags: ["banish", "draw", "sacrifice"],
    difficulty: "medium",
  },
  {
    ...SET008_ACTION_CARDS.find(
      (card) => card.cardName === "Beyond the Horizon",
    )!,
    category: TestCategory.BASIC_DRAW,
    priority: 3,
    tags: ["scry", "deck-manipulation", "advanced"],
    difficulty: "hard",
  },
  {
    ...SET008_ACTION_CARDS.find((card) => card.cardName === "Quick Shot")!,
    category: TestCategory.CONDITIONAL_EFFECTS,
    priority: 2,
    tags: ["damage", "conditional", "bodyguard"],
    difficulty: "hard",
  },
];

/**
 * Test data manager class for organizing and filtering test cases
 */
export class TestDataManager {
  private testCases: CategorizedTestCase[];

  constructor(testCases: CategorizedTestCase[] = CATEGORIZED_TEST_CASES) {
    this.testCases = testCases;
  }

  /**
   * Get test cases by category
   */
  getByCategory(category: TestCategory): CategorizedTestCase[] {
    return this.testCases.filter((tc) => tc.category === category);
  }

  /**
   * Get test cases by priority (1 = highest priority)
   */
  getByPriority(maxPriority: number): CategorizedTestCase[] {
    return this.testCases.filter((tc) => tc.priority <= maxPriority);
  }

  /**
   * Get test cases by difficulty
   */
  getByDifficulty(
    maxDifficulty: "easy" | "medium" | "hard" | "expert",
  ): CategorizedTestCase[] {
    const difficultyOrder = ["easy", "medium", "hard", "expert"];
    const maxIndex = difficultyOrder.indexOf(maxDifficulty);

    return this.testCases.filter((tc) => {
      const tcIndex = difficultyOrder.indexOf(tc.difficulty);
      return tcIndex <= maxIndex;
    });
  }

  /**
   * Get test cases by tags
   */
  getByTags(tags: string[], matchAll = false): CategorizedTestCase[] {
    return this.testCases.filter((tc) => {
      if (matchAll) {
        return tags.every((tag) => tc.tags.includes(tag));
      }
      return tags.some((tag) => tc.tags.includes(tag));
    });
  }

  /**
   * Get filtered test cases based on configuration
   */
  getFilteredTestCases(config: TestSuiteConfig): CategorizedTestCase[] {
    let filtered = [...this.testCases];

    // Filter by categories
    if (config.includeCategories && config.includeCategories.length > 0) {
      filtered = filtered.filter((tc) =>
        config.includeCategories!.includes(tc.category),
      );
    }

    if (config.excludeCategories && config.excludeCategories.length > 0) {
      filtered = filtered.filter(
        (tc) => !config.excludeCategories!.includes(tc.category),
      );
    }

    // Filter by priority
    if (config.maxPriority !== undefined) {
      filtered = filtered.filter((tc) => tc.priority <= config.maxPriority!);
    }

    // Filter by difficulty
    if (config.maxDifficulty) {
      const difficultyOrder = ["easy", "medium", "hard", "expert"];
      const maxIndex = difficultyOrder.indexOf(config.maxDifficulty);
      filtered = filtered.filter((tc) => {
        const tcIndex = difficultyOrder.indexOf(tc.difficulty);
        return tcIndex <= maxIndex;
      });
    }

    // Filter known failures
    if (!config.includeKnownFailures) {
      filtered = filtered.filter((tc) => !tc.missingTestCase);
    }

    return filtered;
  }

  /**
   * Get a balanced test suite with representation from each category
   */
  getBalancedTestSuite(maxCases = 10): CategorizedTestCase[] {
    const categories = Object.values(TestCategory);
    const casesPerCategory = Math.floor(maxCases / categories.length);
    const remainder = maxCases % categories.length;

    const balanced: CategorizedTestCase[] = [];

    categories.forEach((category, index) => {
      const categoryTests = this.getByCategory(category).sort(
        (a, b) => a.priority - b.priority,
      ); // Sort by priority

      const takeCount = casesPerCategory + (index < remainder ? 1 : 0);
      balanced.push(...categoryTests.slice(0, takeCount));
    });

    return balanced.slice(0, maxCases);
  }

  /**
   * Get test cases suitable for regression testing
   */
  getRegressionTestSuite(): CategorizedTestCase[] {
    return this.testCases.filter(
      (tc) =>
        tc.priority <= 2 && // High priority cases
        !tc.missingTestCase && // Known working cases
        tc.difficulty !== "expert", // Exclude expert-level cases
    );
  }

  /**
   * Get test cases for performance benchmarking
   */
  getPerformanceTestSuite(): CategorizedTestCase[] {
    return this.testCases.filter(
      (tc) => tc.difficulty === "easy" || tc.difficulty === "medium",
    );
  }

  /**
   * Get test cases for development and debugging
   */
  getDebugTestSuite(): CategorizedTestCase[] {
    return this.testCases.filter(
      (tc) =>
        tc.priority === 1 && // Highest priority
        tc.difficulty === "easy", // Easiest to debug
    );
  }

  /**
   * Get statistics about the test cases
   */
  getStatistics(): {
    total: number;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
    byPriority: Record<number, number>;
    missingTestCases: number;
  } {
    const stats = {
      total: this.testCases.length,
      byCategory: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byPriority: {} as Record<number, number>,
      missingTestCases: 0,
    };

    this.testCases.forEach((tc) => {
      // Count by category
      stats.byCategory[tc.category] = (stats.byCategory[tc.category] || 0) + 1;

      // Count by difficulty
      stats.byDifficulty[tc.difficulty] =
        (stats.byDifficulty[tc.difficulty] || 0) + 1;

      // Count by priority
      stats.byPriority[tc.priority] = (stats.byPriority[tc.priority] || 0) + 1;

      // Count missing test cases
      if (tc.missingTestCase) {
        stats.missingTestCases++;
      }
    });

    return stats;
  }

  /**
   * Validate test case data integrity
   */
  validateTestCases(): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    this.testCases.forEach((tc, index) => {
      // Check required fields
      if (!tc.cardName) {
        issues.push(`Test case ${index}: Missing card name`);
      }

      if (!tc.text) {
        issues.push(`Test case ${index}: Missing card text`);
      }

      if (!tc.expectedAbilities || tc.expectedAbilities.length === 0) {
        issues.push(`Test case ${index}: Missing expected abilities`);
      }

      if (!tc.category) {
        issues.push(`Test case ${index}: Missing category`);
      }

      if (tc.priority < 1 || tc.priority > 5) {
        issues.push(
          `Test case ${index}: Invalid priority ${tc.priority} (should be 1-5)`,
        );
      }

      if (!["easy", "medium", "hard", "expert"].includes(tc.difficulty)) {
        issues.push(`Test case ${index}: Invalid difficulty ${tc.difficulty}`);
      }

      if (!Array.isArray(tc.tags)) {
        issues.push(`Test case ${index}: Tags should be an array`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}

/**
 * Default test data manager instance
 */
export const testDataManager = new TestDataManager();

/**
 * Convenience functions for common test case selections
 */
export const getBasicTestCases = () => testDataManager.getByDifficulty("easy");
export const getMediumTestCases = () =>
  testDataManager.getByDifficulty("medium");
export const getHardTestCases = () => testDataManager.getByDifficulty("hard");
export const getHighPriorityTestCases = () => testDataManager.getByPriority(1);
export const getRegressionTestCases = () =>
  testDataManager.getRegressionTestSuite();
export const getPerformanceTestCases = () =>
  testDataManager.getPerformanceTestSuite();
export const getDebugTestCases = () => testDataManager.getDebugTestSuite();
