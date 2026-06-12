import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { jiminyCricketGhostOfChristmasPast } from "./146-jiminy-cricket-ghost-of-christmas-past";
import { simbaProtectiveCub } from "../../001";
import { mickeyMouseBobCratchit } from "./159-mickey-mouse-bob-cratchit";
import { mickeyMouseTrueFriend } from "../../001/characters/012-mickey-mouse-true-friend";

describe("Jiminy Cricket - Ghost of Christmas Past", () => {
  it("should be able to activate Boost 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jiminyCricketGhostOfChristmasPast],
      deck: 5,
      inkwell: 10,
    });

    const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

    expect(
      testEngine
        .asPlayerOne()
        .activateAbility(jiminyCricketGhostOfChristmasPast, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
    expect(deckAfter).toBe(deckBefore - 1);
  });

  describe("LOOK INTO YOUR PAST", () => {
    it("trigger fires when Boost puts a card under Jiminy Cricket", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jiminyCricketGhostOfChristmasPast],
        deck: 5,
        inkwell: 10,
        discard: [simbaProtectiveCub],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(jiminyCricketGhostOfChristmasPast, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      // LOOK INTO YOUR PAST should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("controller may choose a card from discard to put into inkwell facedown and exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jiminyCricketGhostOfChristmasPast],
        deck: 5,
        inkwell: 10,
        discard: [simbaProtectiveCub],
      });

      const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(
        testEngine.asPlayerOne().activateAbility(jiminyCricketGhostOfChristmasPast, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jiminyCricketGhostOfChristmasPast, {
          resolveOptional: true,
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      const inkwellAfter = testEngine.asPlayerOne().getZonesCardCount().inkwell;
      expect(inkwellAfter).toBe(inkwellBefore + 1);

      // Simba should be in inkwell, not discard
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("inkwell");
    });

    it("controller may decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jiminyCricketGhostOfChristmasPast],
        deck: 5,
        inkwell: 10,
        discard: [simbaProtectiveCub],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(jiminyCricketGhostOfChristmasPast, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jiminyCricketGhostOfChristmasPast, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Simba should still be in discard
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
    });

    it("trigger fires when a card is moved under Jiminy via Mickey Mouse - Bob Cratchit", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mickeyMouseBobCratchit, exerted: true },
            jiminyCricketGhostOfChristmasPast,
          ],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 2,
        },
      );

      const mickeyBobId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_ONE);
      const jiminyId = testEngine.findCardInstanceId(
        jiminyCricketGhostOfChristmasPast,
        "play",
        PLAYER_ONE,
      );

      // Put a card under Mickey
      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(mickeyBobId, deckCards[0]!);

      testEngine.asPlayerOne().passTurn();

      const opponentMickey = testEngine.findCardInstanceId(
        mickeyMouseTrueFriend,
        "play",
        PLAYER_TWO,
      );
      expect(
        testEngine.asPlayerTwo().challenge(opponentMickey, mickeyBobId),
      ).toBeSuccessfulCommand();

      // Resolve Mickey's A GIVING HEART, choosing Jiminy as the target
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseBobCratchit, {
          targets: [jiminyId],
        }),
      ).toBeSuccessfulCommand();

      // Jiminy's LOOK INTO YOUR PAST should now be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });
  });
});
