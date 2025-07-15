// Automated comparison functions for testing parser output against expected abilities

import type { ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Effect } from "@lorcanito/lorcana-engine/effects/effectTypes";

/**
 * Result of comparing parsed abilities with expected abilities
 */
export interface ComparisonResult {
  /** Whether the comparison passed */
  passed: boolean;
  /** Overall similarity score (0-1) */
  score: number;
  /** Detailed comparison results */
  details: ComparisonDetails;
  /** Issues found during comparison */
  issues: string[];
  /** Suggestions for improvement */
  suggestions: string[];
}

/**
 * Detailed comparison breakdown
 */
export interface ComparisonDetails {
  /** Number of abilities matched */
  abilitiesMatched: number;
  /** Total number of expected abilities */
  totalExpectedAbilities: number;
  /** Number of effects matched */
  effectsMatched: number;
  /** Total number of expected effects */
  totalExpectedEffects: number;
  /** Ability-by-ability comparison results */
  abilityComparisons: AbilityComparison[];
}

/**
 * Comparison result for a single ability
 */
export interface AbilityComparison {
  /** Index of the ability */
  index: number;
  /** Whether this ability matched */
  matched: boolean;
  /** Similarity score for this ability */
  score: number;
  /** Issues with this ability */
  issues: string[];
  /** Effect comparisons within this ability */
  effectComparisons: EffectComparison[];
}

/**
 * Comparison result for a single effect
 */
export interface EffectComparison {
  /** Index of the effect */
  index: number;
  /** Whether this effect matched */
  matched: boolean;
  /** Similarity score for this effect */
  score: number;
  /** Issues with this effect */
  issues: string[];
  /** Properties that matched */
  matchedProperties: string[];
  /** Properties that didn't match */
  mismatchedProperties: string[];
}

/**
 * Configuration for comparison behavior
 */
export interface ComparisonConfig {
  /** Minimum score to consider a match (0-1) */
  matchThreshold: number;
  /** Whether to ignore order of abilities */
  ignoreAbilityOrder: boolean;
  /** Whether to ignore order of effects within abilities */
  ignoreEffectOrder: boolean;
  /** Whether to perform strict type checking */
  strictTypeChecking: boolean;
  /** Whether to compare target structures deeply */
  deepTargetComparison: boolean;
  /** Properties to ignore during comparison */
  ignoredProperties: string[];
}

/**
 * Default comparison configuration
 */
export const DEFAULT_COMPARISON_CONFIG: ComparisonConfig = {
  matchThreshold: 0.8,
  ignoreAbilityOrder: false,
  ignoreEffectOrder: false,
  strictTypeChecking: true,
  deepTargetComparison: true,
  ignoredProperties: [],
};

/**
 * Compares parsed abilities with expected abilities
 */
export function compareAbilities(
  parsed: ResolutionAbility[],
  expected: ResolutionAbility[],
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG,
): ComparisonResult {
  const details: ComparisonDetails = {
    abilitiesMatched: 0,
    totalExpectedAbilities: expected.length,
    effectsMatched: 0,
    totalExpectedEffects: 0,
    abilityComparisons: [],
  };

  const issues: string[] = [];
  const suggestions: string[] = [];

  // Count total expected effects
  details.totalExpectedEffects = expected.reduce(
    (total, ability) => total + (ability.effects?.length || 0),
    0,
  );

  // Basic length check
  if (parsed.length !== expected.length) {
    issues.push(
      `Ability count mismatch: expected ${expected.length}, got ${parsed.length}`,
    );

    if (parsed.length < expected.length) {
      suggestions.push(
        "Parser may be missing some effects or not handling complex patterns",
      );
    } else {
      suggestions.push(
        "Parser may be generating duplicate or unnecessary abilities",
      );
    }
  }

  // Compare each expected ability
  for (let i = 0; i < expected.length; i++) {
    const expectedAbility = expected[i];
    let bestMatch: AbilityComparison | null = null;
    let bestScore = 0;

    // Find the best matching parsed ability
    for (let j = 0; j < parsed.length; j++) {
      const parsedAb = parsed[j];
      if (!parsedAb) continue;

      // @ts-ignore: parsedAb is guaranteed to be non-null by the continue check above
      const comparison = compareAbility(expectedAbility, parsedAb, config);

      if (comparison.score > bestScore) {
        bestScore = comparison.score;
        bestMatch = { ...comparison, index: j };
      }
    }

    if (bestMatch) {
      bestMatch.index = i; // Set to expected index for reporting
      details.abilityComparisons.push(bestMatch);

      if (bestMatch.matched) {
        details.abilitiesMatched++;
      }

      details.effectsMatched += bestMatch.effectComparisons.filter(
        (ec) => ec.matched,
      ).length;
    } else {
      // No match found
      details.abilityComparisons.push({
        index: i,
        matched: false,
        score: 0,
        issues: ["No matching ability found"],
        effectComparisons: [],
      });
    }
  }

  // Calculate overall score
  const abilityScore =
    details.totalExpectedAbilities > 0
      ? details.abilitiesMatched / details.totalExpectedAbilities
      : 0;
  const effectScore =
    details.totalExpectedEffects > 0
      ? details.effectsMatched / details.totalExpectedEffects
      : 0;

  const score = (abilityScore + effectScore) / 2;

  // Collect all issues
  details.abilityComparisons.forEach((ac, index) => {
    if (!ac.matched) {
      issues.push(`Ability ${index + 1}: ${ac.issues.join(", ")}`);
    }
    ac.effectComparisons.forEach((ec, effectIndex) => {
      if (!ec.matched) {
        issues.push(
          `Ability ${index + 1}, Effect ${effectIndex + 1}: ${ec.issues.join(", ")}`,
        );
      }
    });
  });

  // Generate suggestions based on common issues
  if (score < 0.5) {
    suggestions.push(
      "Parser may need significant improvements to handle this card type",
    );
  } else if (score < 0.8) {
    suggestions.push(
      "Parser is partially working but may need refinement for edge cases",
    );
  }

  return {
    passed: score >= config.matchThreshold,
    score,
    details,
    issues,
    suggestions,
  };
}

/**
 * Compares two individual abilities
 */
function compareAbility(
  expected: ResolutionAbility,
  parsed: ResolutionAbility,
  config: ComparisonConfig,
): AbilityComparison {
  const issues: string[] = [];
  const effectComparisons: EffectComparison[] = [];
  let matchedEffects = 0;

  // Check basic ability properties
  if (expected.type !== parsed.type) {
    issues.push(`Type mismatch: expected ${expected.type}, got ${parsed.type}`);
  }

  // Check boolean flags
  if (expected.dependentEffects !== parsed.dependentEffects) {
    issues.push(
      `dependentEffects mismatch: expected ${expected.dependentEffects}, got ${parsed.dependentEffects}`,
    );
  }

  if (
    expected.resolveEffectsIndividually !== parsed.resolveEffectsIndividually
  ) {
    issues.push(
      `resolveEffectsIndividually mismatch: expected ${expected.resolveEffectsIndividually}, got ${parsed.resolveEffectsIndividually}`,
    );
  }

  // Compare effects
  const expectedEffects = expected.effects || [];
  const parsedEffects = parsed.effects || [];

  if (expectedEffects.length !== parsedEffects.length) {
    issues.push(
      `Effect count mismatch: expected ${expectedEffects.length}, got ${parsedEffects.length}`,
    );
  }

  // Compare each expected effect
  for (let i = 0; i < expectedEffects.length; i++) {
    const expectedEffect = expectedEffects[i];
    if (!expectedEffect) continue;

    let bestEffectMatch: EffectComparison | null = null;
    let bestEffectScore = 0;

    // Find best matching parsed effect
    for (let j = 0; j < parsedEffects.length; j++) {
      const parsedEff = parsedEffects[j];
      if (!parsedEff) continue;

      // @ts-ignore: both effects are guaranteed to be valid at this point
      const effectComparison = compareEffect(expectedEffect, parsedEff, config);

      if (effectComparison.score > bestEffectScore) {
        bestEffectScore = effectComparison.score;
        bestEffectMatch = { ...effectComparison, index: j };
      }
    }

    if (bestEffectMatch) {
      bestEffectMatch.index = i; // Set to expected index
      effectComparisons.push(bestEffectMatch);

      if (bestEffectMatch.matched) {
        matchedEffects++;
      }
    } else {
      effectComparisons.push({
        index: i,
        matched: false,
        score: 0,
        issues: ["No matching effect found"],
        matchedProperties: [],
        mismatchedProperties: [],
      });
    }
  }

  // Calculate ability score
  const typeScore = expected.type === parsed.type ? 1 : 0;
  const effectScore =
    expectedEffects.length > 0 ? matchedEffects / expectedEffects.length : 1;
  const score = (typeScore + effectScore) / 2;

  return {
    index: 0, // Will be set by caller
    matched: score >= config.matchThreshold && issues.length === 0,
    score,
    issues,
    effectComparisons,
  };
}

/**
 * Compares two individual effects
 */
function compareEffect(
  expected: Effect,
  parsed: Effect,
  config: ComparisonConfig,
): EffectComparison {
  const issues: string[] = [];
  const matchedProperties: string[] = [];
  const mismatchedProperties: string[] = [];

  // Check effect type
  if (expected.type === parsed.type) {
    matchedProperties.push("type");
  } else {
    mismatchedProperties.push("type");
    issues.push(`Type mismatch: expected ${expected.type}, got ${parsed.type}`);
  }

  // Check amount property
  if ("amount" in expected || "amount" in parsed) {
    if ((expected as any)?.amount === (parsed as any)?.amount) {
      matchedProperties.push("amount");
    } else {
      mismatchedProperties.push("amount");
      issues.push(
        `Amount mismatch: expected ${(expected as any)?.amount}, got ${(parsed as any)?.amount}`,
      );
    }
  }

  // Check attribute property (for attribute effects)
  if ("attribute" in expected || "attribute" in parsed) {
    if ((expected as any)?.attribute === (parsed as any)?.attribute) {
      matchedProperties.push("attribute");
    } else {
      mismatchedProperties.push("attribute");
      issues.push(
        `Attribute mismatch: expected ${(expected as any)?.attribute}, got ${(parsed as any)?.attribute}`,
      );
    }
  }

  // Check duration property
  if ("duration" in expected || "duration" in parsed) {
    if ((expected as any)?.duration === (parsed as any)?.duration) {
      matchedProperties.push("duration");
    } else {
      mismatchedProperties.push("duration");
      issues.push(
        `Duration mismatch: expected ${(expected as any)?.duration}, got ${(parsed as any)?.duration}`,
      );
    }
  }

  // Check target property
  if (
    config.deepTargetComparison &&
    ((expected as any)?.target || (parsed as any)?.target)
  ) {
    const targetComparison = compareTargets(
      (expected as any)?.target,
      (parsed as any)?.target,
    );
    if (targetComparison.matched) {
      matchedProperties.push("target");
    } else {
      mismatchedProperties.push("target");
      issues.push(`Target mismatch: ${targetComparison.issues.join(", ")}`);
    }
  }

  // Calculate effect score
  const totalProperties =
    matchedProperties.length + mismatchedProperties.length;
  const score =
    totalProperties > 0 ? matchedProperties.length / totalProperties : 0;

  return {
    index: 0, // Will be set by caller
    matched: score >= config.matchThreshold && issues.length === 0,
    score,
    issues,
    matchedProperties,
    mismatchedProperties,
  };
}

/**
 * Compares two target structures
 */
function compareTargets(
  expected?: EffectTargets,
  parsed?: EffectTargets,
): { matched: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!(expected || parsed)) {
    return { matched: true, issues: [] };
  }

  if (!(expected && parsed)) {
    issues.push(
      `Target presence mismatch: expected ${!!expected}, got ${!!parsed}`,
    );
    return { matched: false, issues };
  }

  // Compare basic target properties
  if ((expected as any)?.type !== (parsed as any)?.type) {
    issues.push(
      `Target type mismatch: expected ${(expected as any)?.type}, got ${(parsed as any)?.type}`,
    );
  }

  if ((expected as any)?.value !== (parsed as any)?.value) {
    issues.push(
      `Target value mismatch: expected ${(expected as any)?.value}, got ${(parsed as any)?.value}`,
    );
  }

  // Compare filters (simplified comparison)
  const expectedFilters = (expected as any)?.filters || [];
  const parsedFilters = (parsed as any)?.filters || [];

  if (expectedFilters.length !== parsedFilters.length) {
    issues.push(
      `Filter count mismatch: expected ${expectedFilters.length}, got ${parsedFilters.length}`,
    );
  }

  return { matched: issues.length === 0, issues };
}

/**
 * Generates a human-readable comparison report
 */
export function generateComparisonReport(
  result: ComparisonResult,
  cardName: string,
): string {
  const lines: string[] = [];

  lines.push(`=== Comparison Report for "${cardName}" ===`);
  lines.push(
    `Overall Score: ${(result.score * 100).toFixed(1)}% (${result.passed ? "PASS" : "FAIL"})`,
  );
  lines.push(
    `Abilities Matched: ${result.details.abilitiesMatched}/${result.details.totalExpectedAbilities}`,
  );
  lines.push(
    `Effects Matched: ${result.details.effectsMatched}/${result.details.totalExpectedEffects}`,
  );
  lines.push("");

  if (result.issues.length > 0) {
    lines.push("Issues Found:");
    result.issues.forEach((issue) => lines.push(`  - ${issue}`));
    lines.push("");
  }

  if (result.suggestions.length > 0) {
    lines.push("Suggestions:");
    result.suggestions.forEach((suggestion) => lines.push(`  - ${suggestion}`));
    lines.push("");
  }

  // Detailed ability breakdown
  result.details.abilityComparisons.forEach((ac, index) => {
    lines.push(
      `Ability ${index + 1}: ${ac.matched ? "✓" : "✗"} (${(ac.score * 100).toFixed(1)}%)`,
    );
    if (ac.issues.length > 0) {
      ac.issues.forEach((issue) => lines.push(`    - ${issue}`));
    }

    ac.effectComparisons.forEach((ec, effectIndex) => {
      lines.push(
        `  Effect ${effectIndex + 1}: ${ec.matched ? "✓" : "✗"} (${(ec.score * 100).toFixed(1)}%)`,
      );
      if (ec.issues.length > 0) {
        ec.issues.forEach((issue) => lines.push(`      - ${issue}`));
      }
    });
  });

  return lines.join("\n");
}

/**
 * Runs a batch comparison on multiple test cases
 */
export function runBatchComparison(
  testCases: Array<{
    cardName: string;
    parsed: ResolutionAbility[];
    expected: ResolutionAbility[];
  }>,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG,
): {
  overallScore: number;
  passedCount: number;
  totalCount: number;
  results: Array<{ cardName: string; result: ComparisonResult }>;
} {
  const results = testCases.map((testCase) => ({
    cardName: testCase.cardName,
    result: compareAbilities(testCase.parsed, testCase.expected, config),
  }));

  const passedCount = results.filter((r) => r.result.passed).length;
  const overallScore =
    results.reduce((sum, r) => sum + r.result.score, 0) / results.length;

  return {
    overallScore,
    passedCount,
    totalCount: results.length,
    results,
  };
}
