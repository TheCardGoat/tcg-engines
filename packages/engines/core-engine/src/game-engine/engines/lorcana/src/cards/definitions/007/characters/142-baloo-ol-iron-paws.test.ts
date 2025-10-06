/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  donaldDuck,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { grabYourSword } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { belleAccomplishedMystic } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { mosquitoBite } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { balooOlIronPaws } from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Baloo - Ol' Iron Paws", () => {
  describe("FIGHT LIKE A BEAR Your characters with 7 {S} or more can't be dealt damage.", () => {
    it("Only gives effect while in play", async () => {
      const testEngine = new TestEngine({
        play: [goofyKnightForADay],
        hand: [balooOlIronPaws],
        inkwell: balooOlIronPaws.cost,
      });

      expect(
        testEngine.getCardModel(goofyKnightForADay).hasDamageDealtRestriction,
      ).toBe(false);

      await testEngine.playCard(balooOlIronPaws);

      expect(
        testEngine.getCardModel(goofyKnightForADay).hasDamageDealtRestriction,
      ).toBe(true);
    });

    it("As Attacker", async () => {
      const testEngine = new TestEngine(
        {
          play: [balooOlIronPaws, goofyKnightForADay],
        },
        {
          play: [teKaTheBurningOne],
        },
      );

      const attacker = testEngine.getCardModel(goofyKnightForADay);
      const defender = testEngine.getCardModel(teKaTheBurningOne);
      expect(attacker.hasDamageDealtRestriction).toBe(true);

      await testEngine.challenge({
        attacker: goofyKnightForADay,
        defender: teKaTheBurningOne,
        exertDefender: true,
      });

      expect(attacker.damage).toBe(0);
      expect(defender.zone).toBe("discard");
    });

    it("As Defender", async () => {
      const testEngine = new TestEngine(
        {
          play: [teKaTheBurningOne],
        },
        {
          play: [balooOlIronPaws, goofyKnightForADay],
        },
      );

      const attacker = testEngine.getCardModel(teKaTheBurningOne);
      const defender = testEngine.getCardModel(goofyKnightForADay);
      expect(defender.hasDamageDealtRestriction).toBe(true);

      await testEngine.challenge({
        attacker: teKaTheBurningOne,
        defender: goofyKnightForADay,
        exertDefender: true,
      });

      expect(defender.damage).toBe(0);
      expect(attacker.zone).toBe("discard");
    });

    it("Damage from a single target card", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: letTheStormRageOn.cost,
          hand: [letTheStormRageOn],
        },
        {
          play: [balooOlIronPaws, goofyKnightForADay],
        },
      );

      const target = testEngine.getCardModel(goofyKnightForADay);
      await testEngine.playCard(letTheStormRageOn, {
        targets: [goofyKnightForADay],
      });
      expect(target.damage).toBe(0);
    });

    it("Damage from a multi target cards", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: grabYourSword.cost,
          hand: [grabYourSword],
        },
        {
          play: [balooOlIronPaws, goofyKnightForADay],
        },
      );

      const target = testEngine.getCardModel(goofyKnightForADay);
      await testEngine.playCard(grabYourSword);
      expect(target.damage).toBe(0);
    });

    it("Does not prevent 'put' damage effects", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: mosquitoBite.cost,
          hand: [mosquitoBite],
        },
        {
          play: [balooOlIronPaws, goofyKnightForADay],
        },
      );

      const target = testEngine.getCardModel(goofyKnightForADay);
      await testEngine.playCard(mosquitoBite, {
        targets: [goofyKnightForADay],
      });
      expect(target.damage).toBe(1);
    });

    it("Does not prevent 'move' damage effects", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: belleAccomplishedMystic.cost,
          play: [donaldDuck],
          hand: [belleAccomplishedMystic],
        },
        {
          play: [balooOlIronPaws, goofyKnightForADay],
        },
      );

      await testEngine.setCardDamage(donaldDuck, 2);
      await testEngine.playCard(
        belleAccomplishedMystic,
        {
          targets: [donaldDuck],
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [goofyKnightForADay],
      });

      expect(testEngine.getCardModel(donaldDuck).damage).toBe(0);
      expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(2);
    });
  });
});
