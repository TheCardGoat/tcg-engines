import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { doloresMadrigalWithinEarshot } from "./078-dolores-madrigal-within-earshot";

const singer = createMockCharacter({
  id: "dolores-test-singer",
  name: "Test Singer",
  cost: 3,
  lore: 1,
});

const song = createMockSong({
  id: "dolores-test-song",
  name: "Test Song",
  cost: 1,
  text: "Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

describe("Dolores Madrigal - Within Earshot", () => {
  describe("I HEAR YOU - Whenever one of your characters sings a song, chosen opponent reveals their hand.", () => {
    it("reveals the opponent's hand when one of your characters sings a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [doloresMadrigalWithinEarshot, singer],
          hand: [song],
          deck: 1,
        },
        {
          hand: [song],
          deck: 1,
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

      expect(testEngine.asPlayerOne().singSong(song, singer)).toBeSuccessfulCommand();

      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }
    });

    it("does not trigger if Dolores is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [singer],
          hand: [song],
          deck: 1,
        },
        {
          hand: [song],
          deck: 1,
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

      expect(testEngine.asPlayerOne().singSong(song, singer)).toBeSuccessfulCommand();

      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBeUndefined();
      }
    });
  });
});
