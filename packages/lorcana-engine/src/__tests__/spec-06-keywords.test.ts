/**
 * Spec 6: Keywords Test Suite
 *
 * Tests for all 12 Lorcana keywords.
 */

import { describe, expect, it } from "bun:test";
import {
  getAllKeywords,
  getShiftCost,
  getShiftTargetName,
  getTotalKeyword,
  hasBodyguard,
  hasEvasive,
  hasKeyword,
  hasReckless,
  hasRush,
  hasShift,
  hasVanish,
  hasWard,
} from "../card-utils";
import { applyResist, calculateChallengeDamage } from "../combat/challenge";
import { validateQuest } from "../combat/quest";
import {
  calculateTotalChallenger,
  calculateTotalResist,
  canBeChosenBy,
  canBypassDrying,
  canSingSong,
  canSingTogether,
  checkWardProtection,
  createSingerPayment,
  createSupportBonus,
  getValidSupportTargets,
  getVanishRedirect,
  hasSupportKeyword,
  needsDryRequirement,
  shouldVanishRedirect,
} from "../keywords/keyword-effects";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import {
  getSingerValue,
  getSingTogetherValue,
  getTotalKeywordValue,
} from "../types/keywords";
import {
  clearDrying,
  createCardInstanceState,
  exertCard,
} from "../zones/card-state";

const player1 = "player1" as PlayerId;
const player2 = "player2" as PlayerId;
const cardId = (id: string): CardId => id as CardId;

// Helper to create mock cards
function createMockCard(
  overrides: Partial<LorcanaCardDefinition> = {},
): LorcanaCardDefinition {
  return {
    id: `card-${Math.random().toString(36).slice(2)}`,
    name: "Test Card",
    version: "Test Version",
    fullName: "Test Card - Test Version",
    inkType: "amber",
    cost: 3,
    inkable: true,
    cardType: "character",
    strength: 2,
    willpower: 3,
    lore: 1,
    ...overrides,
  };
}

// Helper to create ready, dry state
function createReadyDryState(id: string) {
  return clearDrying(createCardInstanceState(cardId(id)));
}

describe("Spec 6: Keywords", () => {
  describe("Bodyguard (Rule 10.2)", () => {
    it("detects Bodyguard keyword", () => {
      const card = createMockCard({ keywords: ["Bodyguard"] });
      expect(hasBodyguard(card)).toBe(true);
      expect(hasKeyword(card, "Bodyguard")).toBe(true);
    });

    it("returns false for card without Bodyguard", () => {
      const card = createMockCard({ keywords: [] });
      expect(hasBodyguard(card)).toBe(false);
    });

    // Note: Blocking logic tested in spec-05-quest-challenge.test.ts
  });

  describe("Challenger (Rule 10.3)", () => {
    it("adds bonus strength while challenging", () => {
      const card = createMockCard({
        strength: 3,
        keywords: [{ type: "Challenger", value: 2 }],
      });

      const damage = calculateChallengeDamage(card, true);
      expect(damage.totalDamage).toBe(5); // 3 + 2
    });

    it("doesn't add bonus when being challenged", () => {
      const card = createMockCard({
        strength: 3,
        keywords: [{ type: "Challenger", value: 2 }],
      });

      const damage = calculateChallengeDamage(card, false);
      expect(damage.totalDamage).toBe(3); // No bonus
    });

    it("stacks multiple Challenger instances", () => {
      const card = createMockCard({
        strength: 2,
        keywords: [
          { type: "Challenger", value: 2 },
          { type: "Challenger", value: 1 },
        ],
      });

      const total = calculateTotalChallenger(card);
      expect(total.baseValue).toBe(3); // 2 + 1
    });

    it("Challenger +2 and +1 equals +3 total", () => {
      const card = createMockCard({
        strength: 2,
        keywords: [
          { type: "Challenger", value: 2 },
          { type: "Challenger", value: 1 },
        ],
      });

      const damage = calculateChallengeDamage(card, true);
      expect(damage.totalDamage).toBe(5); // 2 + 3
    });

    it("includes additional modifiers in calculation", () => {
      const card = createMockCard({
        strength: 2,
        keywords: [{ type: "Challenger", value: 2 }],
      });

      const total = calculateTotalChallenger(card, [
        { source: "ability", amount: 1 },
      ]);
      expect(total.totalValue).toBe(3); // 2 + 1
    });
  });

  describe("Evasive (Rule 10.4)", () => {
    it("detects Evasive keyword", () => {
      const card = createMockCard({ keywords: ["Evasive"] });
      expect(hasEvasive(card)).toBe(true);
    });

    // Note: Ready target and Bodyguard bypass tested in spec-05
  });

  describe("Reckless (Rule 10.5)", () => {
    it("prevents character from questing", () => {
      const card = createMockCard({ keywords: ["Reckless"] });
      const state = createReadyDryState("char-1");

      const result = validateQuest(card, state, player1, player1, true);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "HAS_RECKLESS")).toBe(true);
    });

    it("detects Reckless keyword", () => {
      const card = createMockCard({ keywords: ["Reckless"] });
      expect(hasReckless(card)).toBe(true);
    });

    it("card without Reckless can quest", () => {
      const card = createMockCard({ keywords: [] });
      const state = createReadyDryState("char-1");

      const result = validateQuest(card, state, player1, player1, true);
      expect(result.valid).toBe(true);
    });
  });

  describe("Resist (Rule 10.6)", () => {
    it("reduces dealt damage by X", () => {
      const card = createMockCard({
        keywords: [{ type: "Resist", value: 2 }],
      });

      const reduced = applyResist(5, card);
      expect(reduced).toBe(3);
    });

    it("stacks multiple Resist instances", () => {
      const card = createMockCard({
        keywords: [
          { type: "Resist", value: 2 },
          { type: "Resist", value: 1 },
        ],
      });

      const total = calculateTotalResist(card);
      expect(total.baseValue).toBe(3);
    });

    it("cannot reduce below 0", () => {
      const card = createMockCard({
        keywords: [{ type: "Resist", value: 10 }],
      });

      const reduced = applyResist(3, card);
      expect(reduced).toBe(0);
    });

    it("includes additional modifiers in total calculation", () => {
      const card = createMockCard({
        keywords: [{ type: "Resist", value: 2 }],
      });

      const total = calculateTotalResist(card, [
        { source: "effect", amount: 1 },
      ]);
      expect(total.totalValue).toBe(3);
    });
  });

  describe("Rush (Rule 10.7)", () => {
    it("can bypass drying requirement", () => {
      const card = createMockCard({ keywords: ["Rush"] });
      expect(canBypassDrying(card)).toBe(true);
    });

    it("card without Rush needs drying requirement", () => {
      const card = createMockCard({ keywords: [] });
      expect(needsDryRequirement(card)).toBe(true);
    });

    it("card with Rush doesn't need drying requirement", () => {
      const card = createMockCard({ keywords: ["Rush"] });
      expect(needsDryRequirement(card)).toBe(false);
    });

    it("detects Rush keyword", () => {
      const card = createMockCard({ keywords: ["Rush"] });
      expect(hasRush(card)).toBe(true);
    });
  });

  describe("Shift (Rule 10.8)", () => {
    it("detects Shift keyword", () => {
      const card = createMockCard({
        keywords: [{ type: "Shift", cost: 3, targetName: "Elsa" }],
      });
      expect(hasShift(card)).toBe(true);
    });

    it("gets Shift cost", () => {
      const card = createMockCard({
        keywords: [{ type: "Shift", cost: 4, targetName: "Elsa" }],
      });
      expect(getShiftCost(card)).toBe(4);
    });

    it("gets Shift target name", () => {
      const card = createMockCard({
        keywords: [{ type: "Shift", cost: 4, targetName: "Elsa" }],
      });
      expect(getShiftTargetName(card)).toBe("Elsa");
    });

    it("returns null for card without Shift", () => {
      const card = createMockCard({ keywords: [] });
      expect(getShiftCost(card)).toBe(null);
      expect(getShiftTargetName(card)).toBe(null);
    });

    // Note: Stack creation and damage transfer tested in zones module
  });

  describe("Singer (Rule 10.9)", () => {
    it("gets Singer value", () => {
      const card = createMockCard({
        keywords: [{ type: "Singer", value: 4 }],
      });
      expect(getSingerValue(card.keywords)).toBe(4);
    });

    it("can sing songs with cost <= singer value", () => {
      const singer = createMockCard({
        keywords: [{ type: "Singer", value: 5 }],
      });
      const state = createReadyDryState("singer");

      expect(canSingSong(singer, state, 3)).toBe(true);
      expect(canSingSong(singer, state, 5)).toBe(true);
      expect(canSingSong(singer, state, 6)).toBe(false);
    });

    it("must be dry to sing", () => {
      const singer = createMockCard({
        keywords: [{ type: "Singer", value: 5 }],
      });
      const dryingState = createCardInstanceState(cardId("singer")); // drying

      expect(canSingSong(singer, dryingState, 3)).toBe(false);
    });

    it("must be ready to sing", () => {
      const singer = createMockCard({
        keywords: [{ type: "Singer", value: 5 }],
      });
      const exertedState = exertCard(createReadyDryState("singer"));

      expect(canSingSong(singer, exertedState, 3)).toBe(false);
    });

    it("returns null for card without Singer", () => {
      const card = createMockCard({ keywords: [] });
      expect(getSingerValue(card.keywords)).toBe(null);
    });
  });

  describe("Sing Together (Rule 10.10)", () => {
    it("gets Sing Together value", () => {
      const card = createMockCard({
        keywords: [{ type: "SingTogether", value: 3 }],
      });
      expect(getSingTogetherValue(card.keywords)).toBe(3);
    });

    it("combines values to meet song cost", () => {
      const singer1 = createMockCard({
        keywords: [{ type: "SingTogether", value: 3 }],
      });
      const singer2 = createMockCard({
        keywords: [{ type: "SingTogether", value: 2 }],
      });
      const state1 = createReadyDryState("singer1");
      const state2 = createReadyDryState("singer2");

      const singers = [
        { card: singer1, state: state1 },
        { card: singer2, state: state2 },
      ];

      expect(canSingTogether(singers, 5)).toBe(true);
      expect(canSingTogether(singers, 6)).toBe(false);
    });

    it("all singers must be dry", () => {
      const singer1 = createMockCard({
        keywords: [{ type: "SingTogether", value: 3 }],
      });
      const singer2 = createMockCard({
        keywords: [{ type: "SingTogether", value: 3 }],
      });
      const state1 = createReadyDryState("singer1");
      const state2 = createCardInstanceState(cardId("singer2")); // drying

      const singers = [
        { card: singer1, state: state1 },
        { card: singer2, state: state2 },
      ];

      expect(canSingTogether(singers, 4)).toBe(false);
    });

    it("creates singer payment info", () => {
      const singer1 = createMockCard({
        keywords: [{ type: "Singer", value: 3 }],
      });
      const singer2 = createMockCard({
        keywords: [{ type: "SingTogether", value: 2 }],
      });

      const payment = createSingerPayment(
        [cardId("s1"), cardId("s2")],
        [singer1, singer2],
        5,
      );

      expect(payment.type).toBe("sing_together");
      expect(payment.singerIds).toHaveLength(2);
      expect(payment.totalValue).toBe(5);
      expect(payment.songCost).toBe(5);
    });
  });

  describe("Support (Rule 10.11)", () => {
    it("detects Support keyword", () => {
      const card = createMockCard({ keywords: ["Support"] });
      expect(hasSupportKeyword(card)).toBe(true);
    });

    it("creates support context with strength bonus", () => {
      const supporter = createMockCard({
        strength: 4,
        keywords: ["Support"],
      });

      const context = createSupportBonus(
        cardId("supporter"),
        supporter,
        cardId("target"),
      );

      expect(context.bonusAmount).toBe(4);
      expect(context.expiresAtEndOfTurn).toBe(true);
    });

    it("can only target other characters (not self)", () => {
      const characters = [
        { cardId: cardId("supporter"), owner: player1 },
        { cardId: cardId("ally1"), owner: player1 },
        { cardId: cardId("ally2"), owner: player1 },
        { cardId: cardId("enemy"), owner: player2 },
      ];

      const targets = getValidSupportTargets(
        cardId("supporter"),
        characters,
        player1,
      );

      expect(targets).toContain("ally1");
      expect(targets).toContain("ally2");
      expect(targets).not.toContain("supporter");
      expect(targets).not.toContain("enemy");
    });
  });

  describe("Vanish (Rule 10.12)", () => {
    it("detects Vanish keyword", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      expect(hasVanish(card)).toBe(true);
    });

    it("banishes card instead of returning to hand", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      expect(shouldVanishRedirect(card, "hand")).toBe(true);
    });

    it("banishes card instead of going to deck", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      expect(shouldVanishRedirect(card, "deck")).toBe(true);
    });

    it("does not redirect when going to discard", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      expect(shouldVanishRedirect(card, "discard")).toBe(false);
    });

    it("does not redirect to inkwell", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      expect(shouldVanishRedirect(card, "inkwell")).toBe(false);
    });

    it("returns redirect info", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      const redirect = getVanishRedirect(cardId("card1"), card, "hand");

      expect(redirect).not.toBe(null);
      expect(redirect!.originalDestination).toBe("hand");
      expect(redirect!.actualDestination).toBe("discard");
    });

    it("returns null for card without Vanish", () => {
      const card = createMockCard({ keywords: [] });
      const redirect = getVanishRedirect(cardId("card1"), card, "hand");
      expect(redirect).toBe(null);
    });

    it("handles implicit hand return correctly", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      // Simulating a "return to hand" effect
      const redirect = getVanishRedirect(cardId("card1"), card, "hand");
      expect(redirect?.actualDestination).toBe("discard");
    });

    it("handles implicit deck return correctly", () => {
      const card = createMockCard({ keywords: ["Vanish"] });
      // Simulating a "put into inkwell" effect (should NOT vanish)
      const redirectInk = shouldVanishRedirect(card, "inkwell");
      expect(redirectInk).toBe(false);

      // Simulating a "shuffle into deck" effect (SHOULD vanish)
      const redirectDeck = shouldVanishRedirect(card, "deck");
      expect(redirectDeck).toBe(true);
    });
  });

  describe("Ward (Rule 10.13)", () => {
    it("detects Ward keyword", () => {
      const card = createMockCard({ keywords: ["Ward"] });
      expect(hasWard(card)).toBe(true);
    });

    it("cannot be chosen by opponent's abilities", () => {
      const card = createMockCard({ keywords: ["Ward"] });

      const result = checkWardProtection(card, player1, player2);

      expect(result.protected).toBe(true);
      expect(result.reason).toBe("ward");
    });

    it("can be chosen by own abilities", () => {
      const card = createMockCard({ keywords: ["Ward"] });

      const result = checkWardProtection(card, player1, player1);

      expect(result.protected).toBe(false);
    });

    it("canBeChosenBy returns false for opponent", () => {
      const card = createMockCard({ keywords: ["Ward"] });
      expect(canBeChosenBy(card, player1, player2)).toBe(false);
    });

    it("canBeChosenBy returns true for owner", () => {
      const card = createMockCard({ keywords: ["Ward"] });
      expect(canBeChosenBy(card, player1, player1)).toBe(true);
    });

    it("card without Ward can be chosen by opponent", () => {
      const card = createMockCard({ keywords: [] });
      expect(canBeChosenBy(card, player1, player2)).toBe(true);
    });
  });

  describe("Keyword Utility Functions", () => {
    it("getAllKeywords returns all keywords", () => {
      const card = createMockCard({
        keywords: ["Bodyguard", "Evasive", { type: "Challenger", value: 2 }],
      });

      const keywords = getAllKeywords(card);
      expect(keywords).toHaveLength(3);
    });

    it("getTotalKeyword returns sum of parameterized keyword", () => {
      const card = createMockCard({
        keywords: [
          { type: "Challenger", value: 2 },
          { type: "Challenger", value: 1 },
        ],
      });

      const total = getTotalKeyword(card, "Challenger");
      expect(total).toBe(3);
    });

    it("getTotalKeywordValue handles undefined keywords", () => {
      const result = getTotalKeywordValue(undefined, "Challenger");
      expect(result).toBe(0);
    });

    it("getTotalKeywordValue handles empty array", () => {
      const result = getTotalKeywordValue([], "Challenger");
      expect(result).toBe(0);
    });
  });
});
