import { describe, expect, test } from "@jest/globals";
import st01Cards from "../../cards/imports/st01.json";
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
  return (st01Cards as GundamCard[]).find((card) => card.code === code);
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
    throw new Error(`Card ${cardCode} not found in ST01 JSON data`);
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
 * Test cases for ST01 (Heroic Beginnings) cards
 * Each test case contains the expected ability structure - card text is sourced from JSON
 */
export const ST01_CARD_TEST_CASES: GundamCardTestCase[] = [
  createTestCase(
    "ST01-001",
    [
      {
        type: "continuous",
        effects: [
          {
            type: "keyword",
            keyword: "Repair",
            value: 2,
            target: undefined,
            duration: undefined,
            gained: undefined,
          },
        ],
        text: "<Repair 2>",
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
              value: "all",
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
              isMultiple: true,
            },
            targetText: "During your turn, all your Units",
            originalText: "During your turn, all your Units get AP+1",
          },
        ],
        trigger: {
          event: "during-pair",
        },
        text: "【during pair】",
      },
    ],
    "Repair keyword ability and conditional attribute boost",
  ),

  createTestCase(
    "ST01-002",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "draw",
            amount: 1,
            target: undefined,
          },
        ],
        trigger: {
          event: "when-paired･(white-base-team)-pilot",
        },
        text: "【when paired･(white base team) pilot】",
      },
    ],
    "Conditional triggered draw ability",
  ),

  createTestCase("ST01-003", [], "No abilities - vanilla unit"),

  createTestCase(
    "ST01-004",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
            condition: "2 or less HP",
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
            targetText: "enemy Unit",
            originalText: "Choose 1 enemy Unit with 2 or less HP.",
          },
          {
            type: "rest",
            target: {
              type: "unit",
              value: "opponent",
              filters: [],
            },
            targetText: "it.",
            originalText: "Rest it.",
          },
        ],
        trigger: {
          event: "deploy",
        },
        text: "【deploy】",
      },
    ],
    "Deploy trigger with conditional targeting",
  ),

  createTestCase("ST01-005", [], "No abilities - vanilla unit"),

  createTestCase(
    "ST01-006",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
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
            targetText: "enemy Unit that is Lv",
            originalText: "Choose 1 enemy Unit that is Lv.",
          },
        ],
        trigger: {
          event: "when-paired",
        },
        text: "【when paired】",
      },
    ],
    "Paired trigger with temporary attribute modification",
  ),

  createTestCase(
    "ST01-008",
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
    "ST01-009",
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
    "Blocker keyword and attack restriction",
  ),

  createTestCase(
    "ST01-010",
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
            type: "targeting",
            amount: "1",
            condition: "5 or less HP",
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
            targetText: "enemy Unit",
            originalText: "Choose 1 enemy Unit with 5 or less HP.",
          },
          {
            type: "rest",
            target: {
              type: "unit",
              value: "opponent",
              filters: [],
            },
            targetText: "it.",
            originalText: "Rest it.",
          },
        ],
        trigger: {
          event: "when-paired",
        },
        text: "【when paired】",
      },
    ],
    "Burst ability and paired abilities",
  ),

  createTestCase(
    "ST01-011",
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
            type: "targeting",
            amount: "1",
            condition: "",
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
            targetText: "of your Resources",
            originalText: "Choose 1 of your Resources.",
          },
        ],
        trigger: {
          event: "once-per-turn",
        },
        text: "【once per turn】",
      },
    ],
    "Burst ability and once-per-turn attack trigger",
  ),

  createTestCase(
    "ST01-012",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
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
            targetText: "rested enemy Unit",
            originalText: "Choose 1 rested enemy Unit.",
          },
          {
            type: "damage",
            amount: 1,
            preventable: true,
            target: {
              type: "unit",
              value: "opponent",
              filters: [],
            },
          },
          {
            type: "damage",
            amount: 1,
            preventable: true,
            target: {
              type: "unit",
              value: "opponent",
              filters: [],
            },
          },
        ],
        trigger: {
          event: "main",
        },
        text: "【main】",
      },
    ],
    "Main phase ability with pilot requirement",
  ),

  createTestCase(
    "ST01-013",
    [
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
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
            targetText: "friendly Unit",
            originalText: "Choose 1 friendly Unit.",
          },
        ],
        trigger: {
          event: "main",
        },
        text: "【main】",
      },
    ],
    "Main phase healing ability with pilot requirement",
  ),

  createTestCase(
    "ST01-014",
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
          event: "burst",
        },
        text: "【burst】",
      },
      {
        type: "triggered",
        effects: [
          {
            type: "targeting",
            amount: "1",
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
            targetText: "enemy Unit",
            originalText: "Choose 1 enemy Unit.",
          },
        ],
        trigger: {
          event: "action",
        },
        text: "【action】",
      },
    ],
    "Burst ability that activates main ability, and dual-timing ability",
  ),

  createTestCase(
    "ST01-015",
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
            type: "rule",
            originalText: "((White Base Team)",
            ruleText: "(White Base Team",
          },
          {
            type: "rule",
            originalText: "((White Base Team)",
            ruleText: "(White Base Team",
          },
          {
            type: "rule",
            originalText: "((White Base Team)",
            ruleText: "(White Base Team",
          },
        ],
        trigger: {
          event: "once-per-turn",
        },
        text: "【once per turn】",
      },
    ],
    "Complex multi-ability card with conditional token deployment",
  ),
];

/**
 * Test suite for parsing card text from ST01 (Heroic Beginnings) set
 */
describe("ST01 Card Text Parser Tests", () => {
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

  describe("All ST01 Cards", () => {
    ST01_CARD_TEST_CASES.forEach((testCase) => {
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
  return ST01_CARD_TEST_CASES.find((card) => card.cardCode === code);
}

export function getTestCasesByAbilityType(
  abilityType: string,
): GundamCardTestCase[] {
  return ST01_CARD_TEST_CASES.filter((card) =>
    card.expectedAbilities.some((ability) => ability.type === abilityType),
  );
}

export function getMissingTestCases(): GundamCardTestCase[] {
  return ST01_CARD_TEST_CASES.filter((card) => card.missingTestCase);
}

export function getBasicTestCases(): GundamCardTestCase[] {
  return ST01_CARD_TEST_CASES.filter(
    (card) =>
      !(
        card.missingTestCase ||
        card.notes?.includes("Complex") ||
        card.notes?.includes("conditional")
      ),
  );
}

export function getComplexTestCases(): GundamCardTestCase[] {
  return ST01_CARD_TEST_CASES.filter(
    (card) =>
      card.notes?.includes("Complex") ||
      card.notes?.includes("conditional") ||
      card.expectedAbilities.some((ability) =>
        ability.effects?.some((effect) => effect.type === "conditional-deploy"),
      ),
  );
}
