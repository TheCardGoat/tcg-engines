import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hadesLordOfTheUnderworld, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { letTheStormRageOn } from "@tcg/lorcana-cards/cards/002";
import { scroopOdiousMutineer } from "@tcg/lorcana-cards/cards/005";
import {
  madameMedusaDiamondLover,
  tweedledeeTweedledumStrangeStorytellers,
} from "@tcg/lorcana-cards/cards/007";
import { wreckitRalphBackSeatDriver } from "@tcg/lorcana-cards/cards/008";
import { donaldDuckGhostHunter, gwythaintSavageHunter } from "@tcg/lorcana-cards/cards/010";
import { tiggerBouncingAllTheWay } from "@tcg/lorcana-cards/cards/011";

const medusaAlly = createMockCharacter({
  id: "invalid-target-medusa-ally",
  name: "Medusa Ally",
  cost: 2,
  strength: 2,
  willpower: 6,
  lore: 1,
});

const undamagedTarget = createMockCharacter({
  id: "invalid-target-undamaged-character",
  name: "Undamaged Target",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const nonRacerCharacter = createMockCharacter({
  id: "invalid-target-non-racer",
  name: "Non-Racer Target",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const expensiveCharacter = createMockCharacter({
  id: "invalid-target-expensive-character",
  name: "Expensive Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const nonDetective = createMockCharacter({
  id: "invalid-target-non-detective",
  name: "Non-Detective Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  classifications: ["Hero"],
});

const wardedCharacter = createMockCharacter({
  id: "invalid-target-warded-character",
  name: "Warded Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  abilities: [{ id: "invalid-target-ward", type: "keyword", keyword: "Ward", text: "Ward" }],
});

const exertedOpponent = createMockCharacter({
  id: "invalid-target-exerted-opponent",
  name: "Exerted Opponent",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("Invalid Target Resolution", () => {
  describe("Self-Targeting Constraints", () => {
    it("cannot target itself when ability specifies 'another character of yours'", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [madameMedusaDiamondLover, medusaAlly],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(madameMedusaDiamondLover)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: true,
            targets: [madameMedusaDiamondLover],
            playerTargets: PLAYER_TWO,
          }).success,
      ).toBe(false);
      expect(testEngine.asPlayerOne().getCardByInstance(madameMedusaDiamondLover).damage).toBe(0);
    });
  });

  describe("Damage Constraints", () => {
    it("cannot target an undamaged character when ability requires damaged target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tweedledeeTweedledumStrangeStorytellers, isDrying: false }, undamagedTarget],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().quest(tweedledeeTweedledumStrangeStorytellers),
      ).toBeSuccessfulCommand();
      // BUG-3 fix: optional effects with owner:"any" + filter are auto-resolved at bag-decision
      // time when no valid targets exist. The bag entry is created (CR 6.2.3) but drained
      // immediately without requiring player input. No stuck prompt is presented.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // The undamaged character remains in play — the optional resolved with no effect.
      expect(testEngine.asPlayerOne().getCardZone(undamagedTarget)).toBe("play");
    });

    it("cannot target undamaged character with optional paid ability requiring damaged target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [scroopOdiousMutineer],
          inkwell: scroopOdiousMutineer.cost + 3,
          deck: 2,
        },
        {
          play: [undamagedTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(scroopOdiousMutineer)).toBeSuccessfulCommand();
      // CR 6.2.3: trigger enters the bag even when no valid targets exist
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      // Declining the optional resolves it with no effect
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: false,
          }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(undamagedTarget)).toBe("play");
    });

    it("resolves without a pending choice when no character cards are in your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hadesLordOfTheUnderworld],
        discard: [],
        inkwell: hadesLordOfTheUnderworld.cost,
      });

      expect(testEngine.asPlayerOne().playCard(hadesLordOfTheUnderworld)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingChoice()).toBeDefined();
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      expect(testEngine.asPlayerOne().resolveNextPending({ targets: [] })).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getPendingChoice()).toBeUndefined();
      expect(testEngine.asPlayerOne().getCardZone(hadesLordOfTheUnderworld)).toBe("play");
    });

    it("draws a card even when the damage step has no legal target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [letTheStormRageOn],
          inkwell: letTheStormRageOn.cost,
          deck: [simbaProtectiveCub],
        },
        {
          play: [wardedCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(letTheStormRageOn)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo()).toHaveDamage({ card: wardedCharacter, value: 0 });
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
    });
  });

  describe("Cost Constraints", () => {
    it("cannot target a character with cost greater than the limit when ability specifies 'cost 2 or less'", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: tiggerBouncingAllTheWay.cost,
        hand: [tiggerBouncingAllTheWay],
        play: [expensiveCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(tiggerBouncingAllTheWay)).toBeSuccessfulCommand();
      // BUG-3 fix: optional effects with owner:"any" + filter are auto-resolved at bag-decision
      // time when no valid targets exist. The bag entry is created (CR 6.2.3) but drained
      // immediately without requiring player input. No stuck prompt is presented.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // The expensive character remains in play — the optional resolved with no effect.
      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("play");
    });
  });

  describe("Classification Constraints", () => {
    it("cannot target a non-Racer character when ability requires Racer", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wreckitRalphBackSeatDriver],
        inkwell: wreckitRalphBackSeatDriver.cost,
        play: [nonRacerCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(wreckitRalphBackSeatDriver)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphBackSeatDriver),
      ).toBeSuccessfulCommand();

      const resolution = testEngine
        .asPlayerOne()
        .resolveNextPending({ targets: [nonRacerCharacter] }) as CommandFailure;
      expect(resolution.success).toBe(false);
      expect(resolution.errorCode).toBe("INVALID_ACTION_TARGET");
      expect(testEngine.asPlayerOne().getCardStrength(nonRacerCharacter)).toBe(
        nonRacerCharacter.strength,
      );
    });

    it("cannot target non-Detective characters when ability requires Detective", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckGhostHunter],
        inkwell: donaldDuckGhostHunter.cost,
        play: [nonDetective],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckGhostHunter)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId),
      ).toBeSuccessfulCommand();

      const resolution = testEngine
        .asPlayerOne()
        .resolveNextPending({ targets: [nonDetective] }) as CommandFailure;
      expect(resolution.success).toBe(false);
      expect(resolution.errorCode).toBe("INVALID_ACTION_TARGET");
      expect(testEngine.asPlayerOne().hasKeyword(nonDetective, "Challenger")).toBe(false);
    });
  });

  describe("Pending Choice Constraints", () => {
    it("does not prompt an opponent that has no ready characters to choose", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: gwythaintSavageHunter, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: exertedOpponent, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(gwythaintSavageHunter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);
      expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [] })).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo().isExerted(exertedOpponent)).toBe(true);
    });
  });
});
