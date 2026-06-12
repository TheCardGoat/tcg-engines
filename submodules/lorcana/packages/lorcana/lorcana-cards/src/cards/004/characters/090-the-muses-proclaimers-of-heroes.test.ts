import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { grabYourSword } from "../../001/actions/198-grab-your-sword";
import { friendsOnTheOtherSide } from "../../001/actions/064-friends-on-the-other-side";
import { princeJohnGreediestOfAll } from "../../002/characters/089-prince-john-greediest-of-all";
import { goofyKnightForADay } from "../../002/characters/180-goofy-knight-for-a-day";
import { aladdinResoluteSwordsman } from "./172-aladdin-resolute-swordsman";
import { auroraTranquilPrincess } from "./141-aurora-tranquil-princess";
import { faLiMulansMother } from "./143-fa-li-mulans-mother";
import { theMusesProclaimersOfHeroes } from "./090-the-muses-proclaimers-of-heroes";
import { suddenChill } from "../../009";
import { liloMakingAWish } from "../../001";

describe("The Muses - Proclaimers of Heroes", () => {
  describe("THE GOSPEL TRUTH - Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.", () => {
    it("should return own character with 2 {S} or less to own hand when a song is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: grabYourSword.cost,
        play: [
          theMusesProclaimersOfHeroes,
          princeJohnGreediestOfAll,
          auroraTranquilPrincess,
          faLiMulansMother,
        ],
        hand: [grabYourSword],
      });

      const targetId = testEngine.findCardInstanceId(princeJohnGreediestOfAll, "play", "p1");
      const notTargetOneId = testEngine.findCardInstanceId(auroraTranquilPrincess, "play", "p1");
      const notTargetTwoId = testEngine.findCardInstanceId(faLiMulansMother, "play", "p1");
      const musesId = testEngine.findCardInstanceId(theMusesProclaimersOfHeroes, "play", "p1");

      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theMusesProclaimersOfHeroes),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetId)).toBe("hand");

      // Other characters should remain in play
      expect(testEngine.asPlayerOne().getCardZone(notTargetOneId)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(notTargetTwoId)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(musesId)).toBe("play");
    });

    it("should return opponent's character with 2 {S} or less to opponent's hand when a song is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: friendsOnTheOtherSide.cost,
          play: [theMusesProclaimersOfHeroes],
          hand: [friendsOnTheOtherSide],
          deck: 3,
        },
        {
          play: [
            aladdinResoluteSwordsman,
            princeJohnGreediestOfAll,
            auroraTranquilPrincess,
            faLiMulansMother,
          ],
        },
      );

      const opponentTargetId = testEngine.findCardInstanceId(
        aladdinResoluteSwordsman,
        "play",
        "p2",
      );
      const notTargetOneId = testEngine.findCardInstanceId(auroraTranquilPrincess, "play", "p2");
      const notTargetTwoId = testEngine.findCardInstanceId(faLiMulansMother, "play", "p2");
      const notTargetThreeId = testEngine.findCardInstanceId(
        princeJohnGreediestOfAll,
        "play",
        "p2",
      );

      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theMusesProclaimersOfHeroes),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentTargetId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentTargetId)).toBe("hand");

      // Other characters should remain in play
      expect(testEngine.asPlayerTwo().getCardZone(notTargetOneId)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(notTargetTwoId)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(notTargetThreeId)).toBe("play");
    });

    it("should allow skipping the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: grabYourSword.cost,
        play: [theMusesProclaimersOfHeroes, princeJohnGreediestOfAll],
        hand: [grabYourSword],
      });

      const targetId = testEngine.findCardInstanceId(princeJohnGreediestOfAll, "play", "p1");
      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theMusesProclaimersOfHeroes, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetId)).toBe("play");
    });

    it("should not return a character with strength greater than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: grabYourSword.cost,
        play: [theMusesProclaimersOfHeroes, goofyKnightForADay, princeJohnGreediestOfAll],
        hand: [grabYourSword],
      });

      const goofyId = testEngine.findCardInstanceId(goofyKnightForADay, "play", "p1");
      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theMusesProclaimersOfHeroes),
      ).toBeSuccessfulCommand();

      // Goofy has strength 10 — targeting him should have no effect
      testEngine.asPlayerOne().resolveNextPending({ targets: [goofyId] });
      expect(testEngine.asPlayerOne().getCardZone(goofyId)).toBe("play");
    });

    it("Should not be able to resolve when an action pending opponent resolution is pending", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: suddenChill.cost,
          play: [theMusesProclaimersOfHeroes, liloMakingAWish],
          hand: [suddenChill],
        },
        {
          hand: [goofyKnightForADay],
        },
      );

      const liloId = testEngine.findCardInstanceId(liloMakingAWish, "play", "p1");
      const discardId = testEngine.findCardInstanceId(goofyKnightForADay, "hand", "p2");

      // Playing Sudden Chill (a song) triggers both:
      // 1. Sudden Chill's effect: opponent must choose and discard a card
      // 2. The Muses' trigger: optional bounce a character with 2 strength or less
      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      // The opponent has a pending choice (Sudden Chill's discard effect)
      const pendingChoice = testEngine.asServer().getState().ctx.priority.pendingChoice;
      expect(pendingChoice).toBeTruthy();

      // The trigger event is queued in pendingEvents but NOT yet in the bag —
      // the engine won't process triggers into the bag until the action fully resolves
      const triggeredState = testEngine.asServer().getState().G.triggeredAbilities;
      expect(triggeredState?.pendingEvents).toHaveLength(1);
      expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

      // Player One has no bag to resolve — the trigger is blocked
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [liloId] }),
      ).not.toBeSuccessfulCommand();

      // Opponent resolves the Sudden Chill discard first
      expect(
        testEngine.asPlayerTwo().resolveEffect(pendingChoice!.requestID, { targets: [discardId] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(discardId)).toBe("discard");

      // Now the action has fully resolved, the trigger is processed into the bag
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeTruthy();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theMusesProclaimersOfHeroes),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [liloId] }),
      ).toBeSuccessfulCommand();

      // Lilo should be bounced back to hand
      expect(testEngine.asPlayerOne().getCardZone(liloId)).toBe("hand");
    });
  });
});
