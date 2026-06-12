import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { mickeyMouseTrueFriend } from "../../001/characters/012-mickey-mouse-true-friend";
import { mickeyMouseBobCratchit } from "./159-mickey-mouse-bob-cratchit";

describe("Mickey Mouse - Bob Cratchit", () => {
  it("can be played onto the board", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseBobCratchit],
      inkwell: mickeyMouseBobCratchit.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(mickeyMouseBobCratchit)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseBobCratchit)).toBe("play");
  });

  describe("HARD WORK - Whenever this character quests, put the top card of your deck facedown under him", () => {
    it("should put the top card of the deck facedown under Mickey when he quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseBobCratchit],
        deck: 5,
      });

      const mickeyId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_ONE);

      expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(0);

      expect(testEngine.asPlayerOne().quest(mickeyMouseBobCratchit)).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(1);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(mickeyMouseBobCratchit.lore);
    });

    it("should accumulate cards under Mickey across multiple quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseBobCratchit],
          deck: 5,
        },
        {
          deck: 2,
        },
      );

      const mickeyId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_ONE);

      // First quest
      expect(testEngine.asPlayerOne().quest(mickeyMouseBobCratchit)).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(1);

      // Pass turns to ready Mickey
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Second quest
      expect(testEngine.asPlayerOne().quest(mickeyMouseBobCratchit)).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(2);
    });
  });

  describe("A GIVING HEART - When this character is banished in a challenge, you may put all cards that were under him under another chosen character or location of yours", () => {
    it("should allow moving cards under Mickey to another character when banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseBobCratchit, exerted: true }, mickeyMouseTrueFriend],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 2,
        },
      );

      const mickeyBobId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_ONE);
      const allyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);

      // Put 2 cards under Mickey Bob Cratchit
      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(mickeyBobId, deckCards[0]!);
      testEngine.putCardUnder(mickeyBobId, deckCards[1]!);
      expect(testEngine.getCardsUnder(mickeyBobId)).toHaveLength(2);

      // Opponent challenges Mickey, dealing lethal damage (Mickey has 2 willpower, TrueFriend has 3 strength)
      testEngine.asPlayerOne().passTurn();

      const opponentMickey = testEngine.findCardInstanceId(
        mickeyMouseTrueFriend,
        "play",
        PLAYER_TWO,
      );
      expect(
        testEngine.asPlayerTwo().challenge(opponentMickey, mickeyBobId),
      ).toBeSuccessfulCommand();

      // A GIVING HEART triggers - resolve the optional effect by choosing the ally
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseBobCratchit, {
            targets: [allyId],
          }),
        ).toBeSuccessfulCommand();
      }

      // The ally should now have the 2 cards under it
      expect(testEngine.getCardsUnder(allyId)).toHaveLength(2);
    });

    it("should allow declining the optional transfer", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseBobCratchit, exerted: true }, mickeyMouseTrueFriend],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 2,
        },
      );

      const mickeyBobId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_ONE);
      const allyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);

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

      // Decline the optional effect
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(mickeyMouseBobCratchit, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Ally should have no cards under
      expect(testEngine.getCardsUnder(allyId)).toHaveLength(0);
    });

    it("should allow moving cards under Mickey when he is banished as the attacker in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseBobCratchit, mickeyMouseTrueFriend],
          deck: 5,
        },
        {
          play: [{ card: mickeyMouseTrueFriend, exerted: true }],
          deck: 2,
        },
      );

      const mickeyBobId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_ONE);
      const allyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);
      const opposingTargetId = testEngine.findCardInstanceId(
        mickeyMouseTrueFriend,
        "play",
        PLAYER_TWO,
      );

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(mickeyBobId, deckCards[0]!);

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseBobCratchit, opposingTargetId),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseBobCratchit, {
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(allyId)).toHaveLength(1);
    });

    it("should NOT trigger when banished by an effect (not a challenge)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [mickeyMouseBobCratchit, mickeyMouseTrueFriend],
          deck: 5,
        },
      );

      const mickeyBobId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_TWO);

      // Put a card under Mickey
      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      testEngine.putCardUnder(mickeyBobId, deckCards[0]!);

      // Banish via Dragon Fire (not a challenge)
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [mickeyMouseBobCratchit],
        }),
      ).toBeSuccessfulCommand();

      // A GIVING HEART should NOT trigger (only triggers on banish in challenge)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});
