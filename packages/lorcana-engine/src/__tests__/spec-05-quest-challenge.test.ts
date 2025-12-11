/**
 * Spec 5: Quest, Challenge & Locations Test Suite
 *
 * Tests for quest and challenge mechanics.
 */

import { describe, expect, it } from "bun:test";
import {
  applyResist,
  calculateChallengeDamage,
  getChallengeableTargets,
  getReadyBodyguards,
  validateChallenge,
  wouldBanish,
} from "../combat/challenge";
import {
  getQuestableCharacters,
  getQuestLore,
  validateQuest,
} from "../combat/quest";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import {
  type CardInstanceState,
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
function createReadyDryState(id: string): CardInstanceState {
  return clearDrying(createCardInstanceState(cardId(id)));
}

describe("Spec 5: Quest, Challenge & Locations", () => {
  describe("Quest (Rule 4.3.5)", () => {
    it("allows ready, dry character to quest", () => {
      const card = createMockCard();
      const state = createReadyDryState("char-1");

      const result = validateQuest(card, state, player1, player1, true);

      expect(result.valid).toBe(true);
    });

    it("rejects exerted character (Rule 4.3.5.4)", () => {
      const card = createMockCard();
      const state = exertCard(createReadyDryState("char-1"));

      const result = validateQuest(card, state, player1, player1, true);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_READY")).toBe(true);
    });

    it("rejects drying character (Rule 4.3.5.5)", () => {
      const card = createMockCard();
      const state = createCardInstanceState(cardId("char-1")); // drying by default

      const result = validateQuest(card, state, player1, player1, true);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_DRY")).toBe(true);
    });

    it("rejects character with Reckless (Rule 4.3.5.6)", () => {
      const card = createMockCard({ keywords: ["Reckless"] });
      const state = createReadyDryState("char-1");

      const result = validateQuest(card, state, player1, player1, true);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "HAS_RECKLESS")).toBe(true);
    });

    it("gains lore equal to character's lore value (Rule 4.3.5.8)", () => {
      const card = createMockCard({ lore: 3 });

      const lore = getQuestLore(card);

      expect(lore).toBe(3);
    });

    it("character with 0 lore can still quest", () => {
      const card = createMockCard({ lore: 0 });
      const state = createReadyDryState("char-1");

      const result = validateQuest(card, state, player1, player1, true);

      expect(result.valid).toBe(true);
      expect(getQuestLore(card)).toBe(0);
    });

    it("rejects non-character cards", () => {
      const card = createMockCard({ cardType: "item" });
      const state = createReadyDryState("item-1");

      const result = validateQuest(card, state, player1, player1, true);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_A_CHARACTER")).toBe(
        true,
      );
    });

    it("getQuestableCharacters filters correctly", () => {
      const characters = [
        {
          cardId: cardId("ready-dry"),
          card: createMockCard(),
          state: createReadyDryState("ready-dry"),
          owner: player1,
        },
        {
          cardId: cardId("exerted"),
          card: createMockCard(),
          state: exertCard(createReadyDryState("exerted")),
          owner: player1,
        },
        {
          cardId: cardId("drying"),
          card: createMockCard(),
          state: createCardInstanceState(cardId("drying")),
          owner: player1,
        },
        {
          cardId: cardId("reckless"),
          card: createMockCard({ keywords: ["Reckless"] }),
          state: createReadyDryState("reckless"),
          owner: player1,
        },
      ];

      const questable = getQuestableCharacters(characters, player1, true);

      expect(questable).toHaveLength(1);
      expect(questable).toContain("ready-dry");
    });
  });

  describe("Challenge Character (Rule 4.3.6)", () => {
    it("allows challenging exerted opponent character", () => {
      const challenger = createMockCard();
      const challengerState = createReadyDryState("challenger");
      const target = createMockCard();
      const targetState = exertCard(createReadyDryState("target"));

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(true);
    });

    it("requires challenger to be ready (Rule 4.3.6.4)", () => {
      const challenger = createMockCard();
      const challengerState = exertCard(createReadyDryState("challenger"));
      const target = createMockCard();
      const targetState = exertCard(createReadyDryState("target"));

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_READY")).toBe(true);
    });

    it("requires challenger to be dry (Rule 4.3.6.5)", () => {
      const challenger = createMockCard();
      const challengerState = createCardInstanceState(cardId("challenger")); // drying
      const target = createMockCard();
      const targetState = exertCard(createReadyDryState("target"));

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "NOT_DRY")).toBe(true);
    });

    it("rejects challenging ready character (Rule 4.3.6.7)", () => {
      const challenger = createMockCard();
      const challengerState = createReadyDryState("challenger");
      const target = createMockCard();
      const targetState = createReadyDryState("target"); // ready, not exerted

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "TARGET_NOT_EXERTED")).toBe(
        true,
      );
    });

    it("rejects challenging own characters", () => {
      const challenger = createMockCard();
      const challengerState = createReadyDryState("challenger");
      const target = createMockCard();
      const targetState = exertCard(createReadyDryState("target"));

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player1, // same owner
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "CANNOT_CHALLENGE_OWN")).toBe(
        true,
      );
    });
  });

  describe("Challenge Damage Step (Rule 4.3.6.13-16)", () => {
    it("damage equals character's strength", () => {
      const card = createMockCard({ strength: 4 });

      const damage = calculateChallengeDamage(card, true);

      expect(damage.baseStrength).toBe(4);
      expect(damage.totalDamage).toBe(4);
    });

    it("applies Challenger bonus only for attacker (Rule 10.3)", () => {
      const card = createMockCard({
        strength: 3,
        keywords: [{ type: "Challenger", value: 2 }],
      });

      const asAttacker = calculateChallengeDamage(card, true);
      const asDefender = calculateChallengeDamage(card, false);

      expect(asAttacker.totalDamage).toBe(5); // 3 + 2
      expect(asDefender.totalDamage).toBe(3); // No bonus
    });

    it("applies Resist to reduce damage taken", () => {
      const card = createMockCard({
        keywords: [{ type: "Resist", value: 2 }],
      });

      const reduced = applyResist(5, card);

      expect(reduced).toBe(3);
    });

    it("Resist cannot reduce below 0", () => {
      const card = createMockCard({
        keywords: [{ type: "Resist", value: 10 }],
      });

      const reduced = applyResist(3, card);

      expect(reduced).toBe(0);
    });

    it("wouldBanish correctly calculates damage >= willpower", () => {
      const card = createMockCard({ willpower: 5 });

      expect(wouldBanish(0, 5, card)).toBe(true);
      expect(wouldBanish(0, 4, card)).toBe(false);
      expect(wouldBanish(3, 2, card)).toBe(true);
      expect(wouldBanish(2, 2, card)).toBe(false);
    });
  });

  describe("Bodyguard (Rule 10.2)", () => {
    it("opponent must challenge Bodyguard first if ready", () => {
      const challenger = createMockCard();
      const challengerState = createReadyDryState("challenger");
      const target = createMockCard();
      const targetState = exertCard(createReadyDryState("target"));
      const bodyguardId = cardId("bodyguard");

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [bodyguardId], // Ready bodyguard present
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "BODYGUARD_BLOCKING")).toBe(
        true,
      );
    });

    it("can challenge Bodyguard itself", () => {
      const challenger = createMockCard();
      const challengerState = createReadyDryState("challenger");
      const bodyguard = createMockCard({
        id: "bodyguard",
        keywords: ["Bodyguard"],
      });
      const bodyguardState = exertCard(createReadyDryState("bodyguard"));

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        bodyguard,
        bodyguardState,
        player2,
        player1,
        true,
        [cardId("bodyguard")],
      );

      expect(result.valid).toBe(true);
    });

    it("getReadyBodyguards filters correctly", () => {
      const characters = [
        {
          cardId: cardId("ready-bodyguard"),
          card: createMockCard({ keywords: ["Bodyguard"] }),
          state: createReadyDryState("ready-bodyguard"),
        },
        {
          cardId: cardId("exerted-bodyguard"),
          card: createMockCard({ keywords: ["Bodyguard"] }),
          state: exertCard(createReadyDryState("exerted-bodyguard")),
        },
        {
          cardId: cardId("regular"),
          card: createMockCard(),
          state: createReadyDryState("regular"),
        },
      ];

      const bodyguards = getReadyBodyguards(characters);

      expect(bodyguards).toHaveLength(1);
      expect(bodyguards).toContain("ready-bodyguard");
    });

    it("verifies multiple bodyguards handling (any can be chosen)", () => {
      const challenger = createMockCard();
      const challengerState = createReadyDryState("challenger");
      const bg1 = createMockCard({
        id: "bg1",
        keywords: ["Bodyguard"],
      });
      const bg1State = createReadyDryState("bg1"); // Ready Bodyguard

      const bg2 = createMockCard({
        id: "bg2",
        keywords: ["Bodyguard"],
      });
      const bg2State = createReadyDryState("bg2"); // Ready Bodyguard

      // Both are valid targets
      const result1 = validateChallenge(
        challenger,
        challengerState,
        player1,
        bg1,
        bg1State,
        player2,
        player1,
        true,
        [cardId("bg1"), cardId("bg2")], // Both present
        cardId("bg1"),
      );

      const result2 = validateChallenge(
        challenger,
        challengerState,
        player1,
        bg2,
        bg2State,
        player2,
        player1,
        true,
        [cardId("bg1"), cardId("bg2")], // Both present
        cardId("bg2"),
      );

      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
    });
  });

  describe("Evasive (Rule 10.4)", () => {
    it("can challenge ready characters", () => {
      const challenger = createMockCard({ keywords: ["Evasive"] });
      const challengerState = createReadyDryState("challenger");
      const target = createMockCard();
      const targetState = createReadyDryState("target"); // Ready!

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(true);
    });

    it("ignores Bodyguard restriction", () => {
      const challenger = createMockCard({ keywords: ["Evasive"] });
      const challengerState = createReadyDryState("challenger");
      const target = createMockCard();
      const targetState = exertCard(createReadyDryState("target"));

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [cardId("bodyguard")], // Bodyguard present but ignored
      );

      expect(result.valid).toBe(true);
    });

    it("can still challenge exerted characters (verification)", () => {
      const challenger = createMockCard({ keywords: ["Evasive"] });
      const challengerState = createReadyDryState("challenger");
      const target = createMockCard();
      const targetState = exertCard(createReadyDryState("target"));

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        target,
        targetState,
        player2,
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(true);
    });
  });

  describe("Challenge Location (Rule 4.3.6.19-22)", () => {
    it("locations can be challenged anytime", () => {
      const challenger = createMockCard();
      const challengerState = createReadyDryState("challenger");
      const location = createMockCard({
        cardType: "location",
        willpower: 5,
        strength: undefined,
      });
      const locationState = createReadyDryState("location"); // Locations are never exerted

      const result = validateChallenge(
        challenger,
        challengerState,
        player1,
        location,
        locationState,
        player2,
        player1,
        true,
        [],
      );

      expect(result.valid).toBe(true);
    });

    it("locations don't deal damage back", () => {
      const location = createMockCard({
        cardType: "location",
        strength: undefined,
      });

      const damage = calculateChallengeDamage(location, false);

      expect(damage.totalDamage).toBe(0);
    });
  });

  describe("Challengeable Targets", () => {
    it("getChallengeableTargets returns correct targets", () => {
      const challenger = createMockCard();
      const targets = [
        {
          cardId: cardId("exerted-char"),
          card: createMockCard(),
          state: exertCard(createReadyDryState("exerted-char")),
        },
        {
          cardId: cardId("ready-char"),
          card: createMockCard(),
          state: createReadyDryState("ready-char"),
        },
        {
          cardId: cardId("location"),
          card: createMockCard({ cardType: "location" }),
          state: createReadyDryState("location"),
        },
        {
          cardId: cardId("item"),
          card: createMockCard({ cardType: "item" }),
          state: createReadyDryState("item"),
        },
      ];

      const challengeable = getChallengeableTargets(challenger, targets);

      expect(challengeable).toContain("exerted-char");
      expect(challengeable).toContain("location");
      expect(challengeable).not.toContain("ready-char");
      expect(challengeable).not.toContain("item");
    });
  });
});
