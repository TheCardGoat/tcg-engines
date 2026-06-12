import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  dinglehopper,
  fireTheCannons,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { theReturnOfHercules } from "@tcg/lorcana-cards/cards/007";
import { simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { minnieMouseStoryteller } from "@tcg/lorcana-cards/cards/007";

describe("#### 7. ZONES", () => {
  describe("# 7.7. Bag", () => {
    it("7.7.2. Only triggered abilities go to the bag; playing cards and resolving actions or activated abilities doesn't put those effects there.", () => {
      const playEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dinglehopper, fireTheCannons],
          inkwell: dinglehopper.cost + fireTheCannons.cost,
        },
        {
          play: [mickeyMouseTrueFriend],
        },
      );

      expect(playEngine.asPlayerOne().playCard(dinglehopper)).toBeSuccessfulCommand();
      expect(playEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(
        playEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [mickeyMouseTrueFriend],
        }).success,
      ).toBe(true);
      expect(playEngine.asPlayerOne().getBagCount()).toBe(0);

      const activatedEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [dinglehopper, { card: arielOnHumanLegs, damage: 1 }],
      });

      const itemId = activatedEngine.asPlayerOne().getCard(dinglehopper).id;
      const targetId = activatedEngine.asPlayerOne().getCard(arielOnHumanLegs).id;
      const activateResult = activatedEngine.executeMoveForView("playerOne", "activateAbility", {
        args: {
          cardId: itemId,
          abilityIndex: 0,
          targets: [targetId],
        },
      });

      expect(activateResult).toBeSuccessfulCommand();
      expect(activatedEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("7.7.3.1. Triggered abilities that happen during another effect wait in the bag until that effect is fully resolved.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theReturnOfHercules, simbaProtectiveCub],
          inkwell: theReturnOfHercules.cost,
          play: [minnieMouseStoryteller],
        },
        {
          hand: [mickeyMouseTrueFriend],
        },
      );

      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "hand", "p1");

      expect(testEngine.asPlayerOne().playCard(theReturnOfHercules)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(theReturnOfHercules, {
          resolveOptional: true,
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: false,
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCard(minnieMouseStoryteller).lore).toBe(
        minnieMouseStoryteller.lore + 1,
      );
    });
  });
});
