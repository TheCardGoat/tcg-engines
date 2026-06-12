// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/06-abilities-effects-and-resolving.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  dinglehopper,
  minnieMouseAlwaysClassy,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  stitchNewDog,
  theQueenWickedAndVain,
} from "@tcg/lorcana-cards/cards/001";
import { akelaForestRunner, ingeniousDevice } from "@tcg/lorcana-cards/cards/010";

describe("# 6. ABILITIES, EFFECTS, AND RESOLVING", () => {
  describe("# 6.3. Activated Abilities", () => {
    it("6.3.1.1. Drying blocks {E} character activations, but same-turn non-{E} character activations still work.", () => {
      const nonExertEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [akelaForestRunner],
        inkwell: [arielOnHumanLegs, minnieMouseAlwaysClassy, simbaProtectiveCub, stitchNewDog],
      });

      expect(nonExertEngine.asPlayerOne().playCard(akelaForestRunner)).toBeSuccessfulCommand();
      expect(nonExertEngine.asPlayerOne().getCardStrength(akelaForestRunner)).toBe(
        akelaForestRunner.strength,
      );

      expect(
        nonExertEngine.asPlayerOne().activateAbility(akelaForestRunner, "AHEAD OF THE PACK 1")
          .success,
      ).toBe(true);
      expect(nonExertEngine.asPlayerOne().isExerted(akelaForestRunner)).toBe(false);
      expect(nonExertEngine.asPlayerOne().getCardStrength(akelaForestRunner)).toBe(
        akelaForestRunner.strength + 1,
      );

      const exertEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theQueenWickedAndVain],
        inkwell: [
          arielOnHumanLegs,
          minnieMouseAlwaysClassy,
          simbaProtectiveCub,
          stitchNewDog,
          mickeyMouseTrueFriend,
        ],
      });

      expect(exertEngine.asPlayerOne().playCard(theQueenWickedAndVain)).toBeSuccessfulCommand();

      const result = exertEngine
        .asPlayerOne()
        .activateAbility(theQueenWickedAndVain, "I SUMMON THEE") as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("CARD_DRYING");
    });

    it("6.3.1.2. An item's activated ability can be used the turn that item is played.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [dinglehopper],
        inkwell: [minnieMouseAlwaysClassy],
        play: [{ card: arielOnHumanLegs, damage: 1 }],
      });

      expect(testEngine.asPlayerOne().playCard(dinglehopper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(1);

      const itemId = testEngine.asPlayerOne().getCard(dinglehopper).id;
      const targetId = testEngine.asPlayerOne().getCard(arielOnHumanLegs).id;
      const result = testEngine.executeMoveForView("playerOne", "activateAbility", {
        args: {
          cardId: itemId,
          abilityIndex: 0,
          targets: [targetId],
        },
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(dinglehopper)).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(0);
    });

    it("6.3.2. A dry character can use its activated ability as the main-phase turn action when nothing is pending.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenWickedAndVain, isDrying: false }],
        deck: [mickeyMouseTrueFriend],
      });

      expect(testEngine.getCurrentPhase()).toBe("main");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain, "I SUMMON THEE").success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().isExerted(theQueenWickedAndVain)).toBe(true);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });

    it("6.3.3. A triggered ability caused during activation waits until the activated ability fully resolves.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseAlwaysClassy],
          inkwell: [mickeyMouseTrueFriend, simbaProtectiveCub],
          deck: [stitchNewDog],
          play: [ingeniousDevice],
        },
        {
          play: [arielOnHumanLegs],
        },
      );

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(0);

      expect(
        testEngine.asPlayerOne().activateAbility(ingeniousDevice, "SURPRISE PACKAGE").success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(ingeniousDevice)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      expect(testEngine.asPlayerOne().getPendingEffects()[0]).toEqual(
        expect.objectContaining({
          type: "discard-choice",
        }),
      );
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(0);

      expect(testEngine.asPlayerOne().respondWith(minnieMouseAlwaysClassy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(0);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(bagEffect!.sourceId, { targets: [arielOnHumanLegs] }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(3);
    });
  });
});
