/**
 * Common interfaces and utilities for Gundam card text parser test cases
 * Similar to Lorcana's test-data-extractor but adapted for Gundam mechanics
 */

/**
 * Base interface for Gundam card test cases
 */
export interface GundamCardTestCase {
  cardCode: string;
  cardName: string;
  cardText: string;
  expectedAbilities: any[];
  cardType?: string;
  colors?: string[];
  rarity?: string;
  cost?: string;
  ap?: string;
  hp?: string;
  level?: string;
  notes?: string;
  missingTestCase?: boolean;
}

/**
 * Interface for effect structures in test cases
 */
export interface ExpectedEffect {
  type: string;
  keyword?: string;
  value?: number;
  amount?: number;
  attribute?: string;
  duration?: string;
  target?: ExpectedTarget;
  conditions?: ExpectedCondition[];
  restriction?: string;
  pilot?: string;
  tokenName?: string;
  traits?: string[];
  stats?: { AP?: number; HP?: number };
  [key: string]: any;
}

/**
 * Interface for target structures in test cases
 */
export interface ExpectedTarget {
  type: "self" | "single" | "multiple" | "all";
  scope?: string;
  player?: "self" | "enemy" | "any";
  unitType?: string;
  conditions?: ExpectedCondition[];
}

/**
 * Interface for condition structures in test cases
 */
export interface ExpectedCondition {
  type: string;
  operator?: "eq" | "ne" | "lt" | "le" | "gt" | "ge" | "lte" | "gte";
  value?: any;
  condition?: string;
  effect?: any;
}

/**
 * Interface for expected abilities in test cases
 */
export interface ExpectedAbility {
  type: "resolution" | "triggered" | "continuous" | "pilot-requirement";
  effects: ExpectedEffect[];
  text?: string;
  trigger?: {
    event: string;
    condition?: string;
  };
  timing?: string | string[];
  cost?: string;
  limitations?: string[];
  duration?: string;
  pilot?: string;
  [key: string]: any;
}

/**
 * Helper function to clean HTML entities from card text
 */
export function cleanCardText(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<br>/g, "\n")
    .replace(/【(.+?)】/g, "【$1】\n") // Add newlines after timing markers
    .trim();
}

/**
 * Helper function to create a basic damage effect
 */
export function createDamageEffect(
  amount: number,
  target: ExpectedTarget,
): ExpectedEffect {
  return {
    type: "damage",
    amount,
    target,
  };
}

/**
 * Helper function to create a basic draw effect
 */
export function createDrawEffect(amount: number): ExpectedEffect {
  return {
    type: "draw",
    amount,
  };
}

/**
 * Helper function to create a keyword effect
 */
export function createKeywordEffect(
  keyword: string,
  value?: number,
): ExpectedEffect {
  return {
    type: "keyword",
    keyword,
    ...(value !== undefined && { value }),
  };
}

/**
 * Helper function to create a target for enemy units
 */
export function createEnemyUnitTarget(
  conditions: ExpectedCondition[] = [],
): ExpectedTarget {
  return {
    type: "single",
    scope: "enemy-unit",
    conditions,
  };
}

/**
 * Helper function to create a target for friendly units
 */
export function createFriendlyUnitTarget(
  conditions: ExpectedCondition[] = [],
): ExpectedTarget {
  return {
    type: "single",
    scope: "friendly-unit",
    conditions,
  };
}

/**
 * Helper function to create a target for all units of a player
 */
export function createAllUnitsTarget(
  player: "self" | "enemy" = "self",
): ExpectedTarget {
  return {
    type: "multiple",
    scope: "all",
    player,
    unitType: "any",
    conditions: [],
  };
}

/**
 * Helper function to create a self target
 */
export function createSelfTarget(): ExpectedTarget {
  return {
    type: "self",
  };
}

/**
 * Helper function to create an HP condition
 */
export function createHPCondition(
  operator: string,
  value: number,
): ExpectedCondition {
  return {
    type: "hp-comparison",
    operator: operator as any,
    value,
  };
}

/**
 * Helper function to create a level condition
 */
export function createLevelCondition(
  operator: string,
  value: number,
): ExpectedCondition {
  return {
    type: "level-comparison",
    operator: operator as any,
    value,
  };
}

/**
 * Helper function to create a state condition
 */
export function createStateCondition(state: string): ExpectedCondition {
  return {
    type: "state",
    value: state,
  };
}

/**
 * Helper function to create a resolution ability
 */
export function createResolutionAbility(
  effects: ExpectedEffect[],
  timing?: string | string[],
  text?: string,
  cost?: string,
  limitations?: string[],
): ExpectedAbility {
  return {
    type: "resolution",
    effects,
    ...(timing && { timing }),
    ...(text && { text }),
    ...(cost && { cost }),
    ...(limitations && { limitations }),
  };
}

/**
 * Helper function to create a triggered ability
 */
export function createTriggeredAbility(
  effects: ExpectedEffect[],
  event: string,
  condition?: string,
  text?: string,
  limitations?: string[],
): ExpectedAbility {
  return {
    type: "triggered",
    effects,
    trigger: {
      event,
      ...(condition && { condition }),
    },
    ...(text && { text }),
    ...(limitations && { limitations }),
  };
}

/**
 * Helper function to create a continuous ability
 */
export function createContinuousAbility(
  effects: ExpectedEffect[],
  text?: string,
): ExpectedAbility {
  return {
    type: "continuous",
    effects,
    ...(text && { text }),
  };
}

/**
 * Helper function to create a pilot requirement
 */
export function createPilotRequirement(
  pilot: string,
  text?: string,
): ExpectedAbility {
  return {
    type: "pilot-requirement",
    pilot,
    effects: [],
    ...(text && { text }),
  };
}

/**
 * Validation helper to check if a test case structure is valid
 */
export function validateTestCase(testCase: GundamCardTestCase): string[] {
  const errors: string[] = [];

  if (!testCase.cardCode) {
    errors.push("Missing cardCode");
  }

  if (!testCase.cardName) {
    errors.push("Missing cardName");
  }

  if (testCase.cardText === undefined) {
    errors.push("Missing cardText");
  }

  if (!Array.isArray(testCase.expectedAbilities)) {
    errors.push("expectedAbilities must be an array");
  }

  // Validate each expected ability
  testCase.expectedAbilities?.forEach((ability, index) => {
    if (!ability.type) {
      errors.push(`Ability ${index}: Missing type`);
    }

    if (!Array.isArray(ability.effects)) {
      errors.push(`Ability ${index}: effects must be an array`);
    }

    ability.effects?.forEach((effect: any, effectIndex: number) => {
      if (!effect.type) {
        errors.push(`Ability ${index}, Effect ${effectIndex}: Missing type`);
      }
    });
  });

  return errors;
}

/**
 * Helper to get test cases by ability type
 */
export function getTestCasesByAbilityType(
  testCases: GundamCardTestCase[],
  abilityType: string,
): GundamCardTestCase[] {
  return testCases.filter((card) =>
    card.expectedAbilities.some((ability) => ability.type === abilityType),
  );
}

/**
 * Helper to get test cases by effect type
 */
export function getTestCasesByEffectType(
  testCases: GundamCardTestCase[],
  effectType: string,
): GundamCardTestCase[] {
  return testCases.filter((card) =>
    card.expectedAbilities.some((ability) =>
      ability.effects.some((effect) => effect.type === effectType),
    ),
  );
}

/**
 * Helper to get test cases marked as missing
 */
export function getMissingTestCases(
  testCases: GundamCardTestCase[],
): GundamCardTestCase[] {
  return testCases.filter((card) => card.missingTestCase);
}

/**
 * Helper to get basic test cases (not complex)
 */
export function getBasicTestCases(
  testCases: GundamCardTestCase[],
): GundamCardTestCase[] {
  return testCases.filter(
    (card) =>
      !(
        card.missingTestCase ||
        card.notes?.includes("Complex") ||
        card.notes?.includes("conditional") ||
        card.notes?.includes("not fully implemented")
      ),
  );
}

/**
 * Helper to get complex test cases
 */
export function getComplexTestCases(
  testCases: GundamCardTestCase[],
): GundamCardTestCase[] {
  return testCases.filter(
    (card) =>
      card.notes?.includes("Complex") ||
      card.notes?.includes("conditional") ||
      card.notes?.includes("Modal") ||
      card.expectedAbilities.some((ability) =>
        ability.effects?.some(
          (effect) =>
            effect.type === "conditional-deploy" ||
            effect.type === "modal" ||
            effect.conditions,
        ),
      ),
  );
}
