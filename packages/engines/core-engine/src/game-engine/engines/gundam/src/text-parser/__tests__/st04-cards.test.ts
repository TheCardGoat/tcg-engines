import { describe, expect, test } from "bun:test";
import st04Cards from "../../cards/imports/st04.json";
import { parseGundamText } from "../index";
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
  createResolutionAbility,
  createSelfTarget,
  createTriggeredAbility,
  GundamCardTestCase,
} from "./test-data-extractor";

/**
 * Helper function to find a card by code from the JSON data
 */
function findCardByCode(code) {
  return st04Cards.find((card) => card.code === code);
}

/**
 * Helper function to create a test case from card code and expected abilities
 */
function createTestCase(cardCode, expectedAbilities, notes, missingTestCase) {
  const card = findCardByCode(cardCode);
  if (!card) {
    throw new Error(`Card ${cardCode} not found in ST04 JSON data`);
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
 * Test cases for ST04 (SEED Strike) cards
 * Each test case contains the expected ability structure - card text is sourced from JSON
 */
export const ST04_CARD_TEST_CASES = [
  createTestCase(
    "ST04-001",
    [
      {
        type: "continuous",
        effects: [
          {
            type: "keyword",
            keyword: "Blocker",
            duration: undefined,
            gained: undefined,
            target: undefined,
            value: undefined,
          },
        ],
        text: "<Blocker>",
      },
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
            condition: "4 or less HP",
            originalText: "Choose 1 enemy Unit with 4 or less HP.",
            target: {
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              isMultiple: false,
              type: "unit",
              value: 1,
              zone: "battlefield",
            },
            targetText: "enemy Unit",
          },
          {
            type: "move-to-hand",
            originalText: "Return it to its owner's hand",
            target: {
              filters: [],
              type: "unit",
              value: "self",
            },
            targetText: "it",
          },
        ],
        text: "【when paired･lv. 4 or higher pilot】",
        trigger: {
          event: "when-paired･lv.-4-or-higher-pilot",
        },
      },
      {
        type: "resolution",
        dependentEffects: false,
        effects: [
          {
            type: "rest",
            originalText: "Rest this Unit to change the attack target to it.",
            target: {
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              isMultiple: false,
              type: "unit",
              value: 1,
              zone: "battlefield",
            },
            targetText: "this Unit to change the attack target to it.",
          },
        ],
        resolveEffectsIndividually: false,
        text: "(Rest this Unit to change the attack target to it.",
      },
    ],
    "Blocker keyword and conditional bounce effect",
    false,
  ),

  createTestCase(
    "ST04-002",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "draw",
            amount: 1,
          },
          {
            type: "discard",
            amount: 1,
            originalText: "discard 1.",
          },
        ],
        trigger: {
          event: "deploy",
        },
        text: "【deploy】",
      },
    ],
    "Deploy trigger with draw and discard effect",
    false,
  ),

  createTestCase("ST04-003", [], "No abilities - vanilla unit", false),

  createTestCase(
    "ST04-004",
    [
      {
        type: "continuous",
        effects: [
          {
            type: "keyword",
            keyword: "Blocker",
            duration: undefined,
            gained: undefined,
            target: undefined,
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
    false,
  ),

  createTestCase(
    "ST04-006",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
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
            condition: "",
            targetText: "enemy Unit that is Lv",
            originalText: "choose 1 enemy Unit that is Lv.",
          },
          {
            type: "damage",
            target: {
              type: "unit",
              value: "opponent",
              filters: [],
            },
            amount: 3,
            preventable: true,
          },
          {
            type: "damage",
            target: {
              type: "unit",
              value: "opponent",
              filters: [],
            },
            amount: 3,
            preventable: true,
          },
        ],
        trigger: {
          event: "attack",
        },
        text: "【attack】",
      },
    ],
    "Attack trigger with conditional damage effect",
    false,
  ),

  createTestCase(
    "ST04-010",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "move-to-hand",
            originalText: "Add this card to your hand",
            target: {
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              type: "unit",
              value: "self",
              zone: "battlefield",
            },
            targetText: "this card",
          },
        ],
        text: "【burst】",
        trigger: {
          event: "burst",
        },
      },
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
            condition: "",
            originalText: "Choose 1 enemy Unit.",
            target: {
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
              ],
              isMultiple: false,
              type: "unit",
              value: 1,
              zone: "battlefield",
            },
            targetText: "enemy Unit",
          },
          {
            type: "attribute-boost",
            amount: -2,
            attribute: "AP",
            duration: "turn",
            originalText: "It gets AP-2",
            target: {
              filters: [],
              type: "unit",
              value: "self",
            },
            targetText: "It",
          },
        ],
        text: "【attack】",
        trigger: {
          event: "attack",
        },
      },
    ],
    "Burst and attack trigger abilities",
    false,
  ),

  createTestCase(
    "ST04-011",
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
    ],
    "Burst trigger with move-to-hand effect",
    false,
  ),

  createTestCase(
    "ST04-015",
    [
      {
        type: "continuous",
        effects: [
          {
            type: "keyword",
            keyword: "Blocker",
            duration: undefined,
            gained: undefined,
            target: undefined,
            value: undefined,
          },
        ],
        text: "<Blocker>",
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
          event: "burst",
        },
        text: "【burst】",
      },
      {
        type: "triggered",
        effects: [
          {
            type: "move-to-hand",
            target: {
              type: "unit",
              value: 1,
              filters: [
                {
                  filter: "type",
                  value: "unit",
                },
                {
                  filter: "owner",
                  value: "self",
                },
              ],
              zone: "battlefield",
              isMultiple: false,
            },
            targetText: "1 of your Shields",
            originalText: "Add 1 of your Shields to your hand",
          },
        ],
        trigger: {
          event: "deploy",
        },
        text: "【deploy】",
      },
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
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
            condition: ".",
            targetText: "friendly Unit",
            originalText: "Choose 1 friendly Unit with .",
          },
        ],
        trigger: {
          event: "once-per-turn",
        },
        text: "【once per turn】",
      },
    ],
    "Complex multi-ability card with Blocker, Burst, Deploy, and activated abilities",
    false,
  ),

  // Add more test cases as needed
];

/**
 * Test suite for parsing card text from ST04 (SEED Strike) set
 */
describe("ST04 Card Text Parser Tests", () => {
  // Test each card in the test cases
  describe("All ST04 Cards", () => {
    ST04_CARD_TEST_CASES.forEach((testCase) => {
      // Skip cards with no expected abilities if they have no card text
      if (
        testCase.expectedAbilities.length === 0 &&
        (!testCase.cardText || testCase.cardText === "-")
      ) {
        return;
      }

      test(`${testCase.cardCode} - ${testCase.cardName}`, () => {
        const cleanedText = cleanCardText(testCase.cardText);
        const result = parseGundamText(cleanedText);

        expect(result).toBeDefined();
        expect(result.errors).toHaveLength(0);

        expect(result.abilities).toEqual(testCase.expectedAbilities);
      });
    });
  });
});

// Helper functions to get test cases for specific scenarios
export function getTestCaseByCode(code) {
  return ST04_CARD_TEST_CASES.find((testCase) => testCase.cardCode === code);
}

export function getTestCasesByAbilityType(abilityType) {
  return ST04_CARD_TEST_CASES.filter((testCase) =>
    testCase.expectedAbilities.some((ability) => ability.type === abilityType),
  );
}

export function getMissingTestCases() {
  return ST04_CARD_TEST_CASES.filter((testCase) => testCase.missingTestCase);
}
function generateActionAbilitiesFromText(arg0: string) {
  throw new Error("Function not implemented.");
}
