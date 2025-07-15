import { describe, expect, test } from "@jest/globals";
import { parseGundamText } from "../index";

/**
 * Test suite for parsing card text from ST01 (Heroic Beginnings) set
 *
 * These tests verify that the parser correctly handles various effect types
 * including keyword abilities, triggered abilities, and more complex effects.
 */
describe("ST01 Card Text Parser Tests", () => {
  // Helper function to clean HTML entities from card text
  function cleanCardText(text: string): string {
    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<br>/g, "\n")
      .replace(/【(.+?)】/g, "【$1】\n") // Add newlines after timing markers
      .trim();
  }

  // Helper to create a standardized test for a card
  function testCard(cardCode: string, cardName: string, cardText: string) {
    test(`${cardCode} - ${cardName}`, () => {
      // Skip empty card texts
      if (cardText === "-") {
        return;
      }

      const cleanedText = cleanCardText(cardText);
      const result = parseGundamText(cleanedText);

      // Basic validation
      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);

      // Should have at least one ability for non-empty text
      if (cleanedText.length > 0) {
        expect(result.abilities.length).toBeGreaterThan(0);
      }
    });
  }

  // Test cases for cards with keyword abilities
  describe("Keyword Abilities", () => {
    test("ST01-001 - Gundam - Repair Keyword", () => {
      const cardText =
        "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Pair】During your turn, all your Units get AP+1.";
      const result = parseGundamText(cardText);

      // Verify we have abilities
      expect(result.abilities.length).toBeGreaterThan(0);

      // Verify no errors
      expect(result.errors).toHaveLength(0);
    });

    test("ST01-008 - Demi Trainer - Blocker Keyword", () => {
      const cardText =
        "<Blocker> (Rest this Unit to change the attack target to it.)";
      const result = parseGundamText(cardText);

      // Should parse abilities
      expect(result.abilities.length).toBeGreaterThan(0);

      // Verify no errors
      expect(result.errors).toHaveLength(0);
    });
  });

  // Test cases for cards with deploy triggers
  describe("Deploy Triggers", () => {
    test("ST01-004 - Guntank - Deploy Effect", () => {
      const cardText =
        "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.";
      const result = parseGundamText(cardText);

      // Should parse abilities
      expect(result.abilities.length).toBeGreaterThan(0);

      // Verify no errors
      expect(result.errors).toHaveLength(0);
    });
  });

  // Test cases for cards with Burst abilities
  describe("Burst Abilities", () => {
    test("ST01-010 - Amuro Ray - Burst Effect", () => {
      const cardText =
        "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.";
      const result = parseGundamText(cardText);

      // Should parse abilities
      expect(result.abilities.length).toBeGreaterThan(0);

      // Verify no errors
      expect(result.errors).toHaveLength(0);
    });
  });

  // Test cases for complex cards with multiple abilities
  describe("Complex Card Text", () => {
    test("ST01-015 - White Base - Multiple Abilities", () => {
      const cardText =
        "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n【Activate･Main】【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.";
      const result = parseGundamText(cardText);

      // Should parse multiple abilities
      expect(result.abilities.length).toBeGreaterThan(1);

      // Verify no errors
      expect(result.errors).toHaveLength(0);
    });
  });

  // Test cases for cards with Attack triggers
  describe("Attack Triggers", () => {
    test("ST01-011 - Suletta Mercury - Attack Once Per Turn", () => {
      const cardText =
        "【Burst】Add this card to your hand.\n【Attack】【Once per Turn】Choose 1 of your Resources. Set it as active.";
      const result = parseGundamText(cardText);

      // Should parse abilities
      expect(result.abilities.length).toBeGreaterThan(0);

      // Verify no errors
      expect(result.errors).toHaveLength(0);
    });
  });

  // Test specific card examples from ST01
  describe("Specific ST01 Cards", () => {
    // Test each specific card from ST01 here
    testCard(
      "ST01-001",
      "Gundam",
      "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Pair】During your turn, all your Units get AP+1.",
    );
    testCard(
      "ST01-002",
      "Gundam (MA Form)",
      "【When Paired･(White Base Team) Pilot】Draw 1.",
    );
    testCard("ST01-003", "Guncannon", "-");
    testCard(
      "ST01-004",
      "Guntank",
      "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.",
    );
    testCard("ST01-005", "GM", "-");
    testCard(
      "ST01-006",
      "Gundam Aerial",
      "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.",
    );
    testCard(
      "ST01-008",
      "Demi Trainer",
      "<Blocker> (Rest this Unit to change the attack target to it.)",
    );
    testCard(
      "ST01-009",
      "Zowort",
      "<Blocker> (Rest this Unit to change the attack target to it.)\nThis Unit can't choose the enemy player as its attack target.",
    );
    testCard(
      "ST01-012",
      "Thoroughly Damaged",
      "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.\n【Pilot】[Hayato Kobayashi]",
    );
    testCard(
      "ST01-013",
      "Kai's Resolve",
      "【Main】Choose 1 friendly Unit. It recovers 3 HP.\n【Pilot】[Kai Shiden]",
    );
    testCard(
      "ST01-014",
      "Unforeseen Incident",
      "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit. It gets AP-3 during this turn.",
    );
  });
});
