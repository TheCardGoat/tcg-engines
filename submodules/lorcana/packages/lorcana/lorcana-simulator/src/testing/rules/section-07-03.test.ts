import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  fireTheCannons,
  friendsOnTheOtherSide,
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
  moanaChosenByTheOcean,
  stitchNewDog,
  tinkerBellPeterPansAlly,
} from "@tcg/lorcana-cards/cards/001";
import { cursedMerfolkUrsulasHandiwork } from "@tcg/lorcana-cards/cards/003";
import { goodJob } from "@tcg/lorcana-cards/cards/006";

describe("#### 7. ZONES", () => {
  describe("# 7.3. Hand", () => {
    it("7.3.3. There's no maximum hand size.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [
          friendsOnTheOtherSide,
          arielOnHumanLegs,
          fireTheCannons,
          mickeyMouseTrueFriend,
          moanaChosenByTheOcean,
          stitchNewDog,
          tinkerBellPeterPansAlly,
        ],
        inkwell: friendsOnTheOtherSide.cost,
        deck: [minnieMouseAlwaysClassy, goodJob],
      });

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(7);
      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(8);
    });

    it("7.3.4. Discarding moves the chosen card from hand to the discard pile.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [goodJob],
          play: [{ card: minnieMouseAlwaysClassy, isDrying: false }],
        },
        {
          play: [cursedMerfolkUrsulasHandiwork],
        },
      );

      testEngine.asServer().manualExertCard(cursedMerfolkUrsulasHandiwork);

      expect(
        testEngine.asPlayerOne().challenge(minnieMouseAlwaysClassy, cursedMerfolkUrsulasHandiwork)
          .success,
      ).toBe(true);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      const goodJobId = testEngine.findCardInstanceId(goodJob, "hand", "player_one");
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(bagEffect!.sourceId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [goodJobId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(goodJob)).toBe("discard");
    });
  });
});
