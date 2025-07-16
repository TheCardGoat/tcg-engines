import { describe, expect, test } from "@jest/globals";
import st02Cards from "../../cards/imports/st02.json";
import { parseGundamText } from "../index";
import type { GundamCardTestCase } from "./test-data-extractor";
import {
  cleanCardText,
  createAllUnitsTarget,
  createContinuousAbility,
  createDamageEffect,
  createDrawEffect,
  createEnemyUnitTarget,
  createFriendlyUnitTarget,
  createHPCondition,
  createKeywordEffect,
  createLevelCondition,
  createPilotRequirement,
  createResolutionAbility,
  createSelfTarget,
  createStateCondition,
  createTriggeredAbility,
} from "./test-data-extractor";
import type { GundamCard } from "./test-utils";

/**
 * Helper function to find a card by code from the JSON data
 */
function findCardByCode(code: string): GundamCard | undefined {
  return (st02Cards as GundamCard[]).find((card) => card.code === code);
}

/**
 * Helper function to create a test case from card code and expected abilities
 */
function createTestCase(
  cardCode: string,
  expectedAbilities: any[],
  notes?: string,
  missingTestCase?: boolean,
): GundamCardTestCase {
  const card = findCardByCode(cardCode);
  if (!card) {
    throw new Error(`Card ${cardCode} not found in ST02 JSON data`);
  }

  return {
    cardCode: card.code,
    cardName: card.name,
    cardText: card.effect || "",
    expectedAbilities,
    cardType: card.cardType,
    cost: card.cost,
    ap: card.ap,
    hp: card.hp,
    level: card.level,
    notes,
    missingTestCase,
  };
}

/**
 * Test cases for ST02 (Wings of Advance) cards
 * Each test case contains the expected ability structure - card text is sourced from JSON
 */
export const ST02_CARD_TEST_CASES: GundamCardTestCase[] = [
  createTestCase(
    "ST02-001",
    [
      {
        type: "continuous",
        effects: [
          {
            type: "keyword",
            keyword: "Breach",
            value: 5,
            target: undefined,
            duration: undefined,
            gained: undefined,
          },
        ],
        text: "<Breach 5>",
      },
      {
        type: "resolution",
        effects: [
          {
            type: "targeting",
            amount: "an",
            condition: "",
            target: {
              type: "unit",
              value: 1,
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              zone: "battlefield",
              isMultiple: false,
            },
            targetText: "active enemy Unit that is Lv",
            originalText: "choose an active enemy Unit that is Lv.",
          },
        ],
        text: ") This Unit may choose an active enemy Unit that is Lv.",
        dependentEffects: false,
        resolveEffectsIndividually: false,
      },
    ],
    "Breach keyword with level-based targeting",
  ),

  createTestCase(
    "ST02-002",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "placeholder",
            parameters: {},
          },
        ],
        trigger: {
          event: "deploy",
        },
        text: "【deploy】",
      },
    ],
    "Deploy trigger with EX Resource placement",
  ),

  createTestCase(
    "ST02-003",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "damage",
            amount: 1,
            preventable: true,
            target: {
              type: "unit",
              value: "all",
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
                {
                  filter: "owner",
                  value: "opponent",
                },
              ],
              zone: "battlefield",
              isMultiple: true,
            },
          },
          {
            type: "damage",
            amount: 1,
            preventable: true,
            target: {
              type: "unit",
              value: "all",
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
                {
                  filter: "owner",
                  value: "opponent",
                },
              ],
              zone: "battlefield",
              isMultiple: true,
            },
          },
        ],
        trigger: {
          event: "during-pair",
        },
        text: "【during pair】",
      },
    ],
    "During Pair trigger with conditional area damage",
  ),

  createTestCase("ST02-004", [], "No abilities - vanilla unit"),

  createTestCase("ST02-005", [], "No abilities - vanilla unit"),

  createTestCase(
    "ST02-006",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "placeholder",
            parameters: {},
          },
        ],
        trigger: {
          event: "activate･main",
        },
        text: "【Activate･Main】",
      },
      {
        type: "triggered",
        effects: [
          {
            type: "placeholder",
            parameters: {},
          },
        ],
        trigger: {
          event: "once-per-turn",
        },
        text: "【Once per Turn】",
      },
    ],
    "Activate Main ability with cost and once per turn limitation",
  ),

  createTestCase("ST02-007", [], "No abilities - vanilla unit"),

  createTestCase(
    "ST02-008",
    [
      {
        type: "continuous",
        effects: [
          {
            type: "keyword",
            keyword: "Blocker",
            target: undefined,
            duration: undefined,
            gained: undefined,
            value: undefined,
          },
        ],
        text: "<Blocker>",
      },
      {
        type: "resolution",
        effects: [
          {
            type: "rest",
            target: {
              type: "unit",
              value: 1,
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              zone: "battlefield",
              isMultiple: false,
            },
            targetText: "this Unit to change the attack target to it.",
            originalText: "Rest this Unit to change the attack target to it.",
          },
        ],
        text: "(Rest this Unit to change the attack target to it.",
        dependentEffects: false,
        resolveEffectsIndividually: false,
      },
    ],
    "Blocker keyword ability",
  ),

  createTestCase(
    "ST02-009",
    [
      {
        type: "continuous",
        effects: [
          {
            type: "keyword",
            keyword: "Blocker",
            target: undefined,
            duration: undefined,
            gained: undefined,
            value: undefined,
          },
        ],
        text: "<Blocker>",
      },
      {
        type: "resolution",
        effects: [
          {
            type: "rest",
            target: {
              type: "unit",
              value: 1,
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              zone: "battlefield",
              isMultiple: false,
            },
            targetText: "this Unit to change the attack target to it.",
            originalText: "Rest this Unit to change the attack target to it.",
          },
        ],
        text: "(Rest this Unit to change the attack target to it.",
        dependentEffects: false,
        resolveEffectsIndividually: false,
      },
    ],
    "Blocker keyword ability",
  ),

  createTestCase(
    "ST02-010",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "move-to-hand",
            target: {
              type: "unit",
              value: "self",
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              zone: "battlefield",
            },
            targetText: "this card",
            originalText: "Add this card to your hand",
          },
        ],
        trigger: {
          event: "burst",
        },
        text: "【burst】",
      },
      {
        type: "triggered",
        effects: [
          {
            type: "attribute-boost",
            amount: 1,
            attribute: "AP",
            duration: "turn",
            target: {
              type: "unit",
              value: "self",
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              zone: "battlefield",
            },
            targetText: "This Unit",
            originalText: "This Unit gets AP+1",
          },
        ],
        trigger: {
          event: "during-link",
        },
        text: "【during link】",
      },
    ],
    "Burst ability and during link attribute boosts",
  ),
];

/**
 * Test suite for parsing card text from ST02 (Wings of Advance) set
 */
describe("ST02 Card Text Parser Tests", () => {
  /**
   * Helper to create a standardized test for a card
   */
  function testCard(testCase: GundamCardTestCase) {
    test(`${testCase.cardCode} - ${testCase.cardName}`, () => {
      // Skip empty card texts
      if (testCase.cardText === "-" || !testCase.cardText) {
        expect(testCase.expectedAbilities).toHaveLength(0);
        return;
      }

      const cleanedText = cleanCardText(testCase.cardText);
      const result = parseGundamText(cleanedText);

      // Basic validation
      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);

      expect(result.abilities).toEqual(testCase.expectedAbilities);
    });
  }

  describe("All ST02 Cards", () => {
    ST02_CARD_TEST_CASES.forEach((testCase) => {
      testCard(testCase);
    });
  });
});

/**
 * Export helper functions for use in other tests
 */
export function getTestCaseByCode(
  code: string,
): GundamCardTestCase | undefined {
  return ST02_CARD_TEST_CASES.find((card) => card.cardCode === code);
}

export function getTestCasesByAbilityType(
  abilityType: string,
): GundamCardTestCase[] {
  return ST02_CARD_TEST_CASES.filter((card) =>
    card.expectedAbilities.some((ability) => ability.type === abilityType),
  );
}

export function getMissingTestCases(): GundamCardTestCase[] {
  return ST02_CARD_TEST_CASES.filter((card) => card.missingTestCase);
}

export function getBasicTestCases(): GundamCardTestCase[] {
  return ST02_CARD_TEST_CASES.filter(
    (card) =>
      !(
        card.missingTestCase ||
        card.notes?.includes("Complex") ||
        card.notes?.includes("conditional")
      ),
  );
}

export function getComplexTestCases(): GundamCardTestCase[] {
  return ST02_CARD_TEST_CASES.filter(
    (card) =>
      card.notes?.includes("Complex") ||
      card.notes?.includes("conditional") ||
      card.expectedAbilities.some((ability) =>
        ability.effects?.some((effect) => effect.type === "conditional-deploy"),
      ),
  );
}
