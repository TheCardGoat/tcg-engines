import { describe, expect, it } from "bun:test";
import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { bePrepared } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { fangRiverCity } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import { unconventionalTool } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import type {
  LorcanaActionCardDefinition,
  LorcanaCharacterCardDefinition,
} from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { playCardMove } from "~/game-engine/engines/lorcana/src/moves/play-card";
import type { LorcanaEnumerableMove } from "~/game-engine/engines/lorcana/src/moves/types";
import { LorcanaTestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import {
  mockActionCard,
  mockCharacterCard,
} from "~/game-engine/engines/lorcana/src/testing/mockCards";

const mockCharacter: LorcanaCharacterCardDefinition = {
  ...mockCharacterCard,
  id: "mock-weak-character",
  name: "Mock Weak Character",
  cost: 1, // Not enough to play the song directly
};

const mockSingerCharacter: LorcanaCharacterCardDefinition = {
  ...mockCharacterCard,
  id: "mock-singer-character",
  name: "Mock Singer Character",
  cost: 2, // Enough to play the song directly
};

const mockSongCard: LorcanaActionCardDefinition = {
  ...mockActionCard,
  id: "mock-song-card",
  name: "Mock Song",
  cost: 2,
  characteristics: ["song"],
};

describe("Move: Play Card", () => {
  describe("Basic validation", () => {
    it("Play Character", () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: liloMakingAWish.cost,
        hand: [liloMakingAWish],
      });
      const cardUnderTest = testEngine.getCardModel(liloMakingAWish);

      expect(cardUnderTest.zone).toEqual("hand");
      expect(testEngine.getAvailableInk()).toEqual(1);

      testEngine.playCard(liloMakingAWish);

      expect(cardUnderTest.zone).toEqual("play");
      expect(testEngine.getAvailableInk()).toEqual(0);
    });

    it("Play Location", () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: fangRiverCity.cost,
        hand: [fangRiverCity],
      });
      const cardUnderTest = testEngine.getCardModel(fangRiverCity);

      expect(cardUnderTest.zone).toEqual("hand");
      expect(testEngine.getAvailableInk()).toEqual(fangRiverCity.cost);

      testEngine.playCard(fangRiverCity);

      expect(cardUnderTest.zone).toEqual("play");
      expect(testEngine.getAvailableInk()).toEqual(0);
    });

    it("Play Item", () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: unconventionalTool.cost,
        hand: [unconventionalTool],
      });
      const cardUnderTest = testEngine.getCardModel(unconventionalTool);

      expect(cardUnderTest.zone).toEqual("hand");
      expect(testEngine.getAvailableInk()).toEqual(unconventionalTool.cost);

      testEngine.playCard(unconventionalTool);

      expect(cardUnderTest.zone).toEqual("play");
      expect(testEngine.getAvailableInk()).toEqual(0);
    });

    it("Play Action", () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: bePrepared.cost,
        hand: [bePrepared],
      });
      const cardUnderTest = testEngine.getCardModel(bePrepared);

      expect(cardUnderTest.zone).toEqual("hand");
      expect(testEngine.getAvailableInk()).toEqual(bePrepared.cost);

      testEngine.playCard(bePrepared);

      expect(cardUnderTest.zone).toEqual("discard");
      expect(testEngine.getAvailableInk()).toEqual(0);
    });

    it("should return invalid move for insufficient ink", () => {
      const mockCard = {
        instanceId: "test-card-id",
        card: { cost: 5, type: ["Character"] },
      };

      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: () => mockCard,
          getCardsInZone: () => [mockCard],
          getAvailableInk: () => 3, // Less than card cost
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = (playCardMove as LorcanaEnumerableMove).execute(
        mockContext as any,
        "test-card-id",
      );

      expect(result).toEqual(
        createInvalidMove(
          "INSUFFICIENT_INK",
          "moves.playCard.errors.insufficientInk",
          {
            required: 5,
            available: 3,
            playerId: "player_one",
          },
        ),
      );
    });
  });

  it("Sings a Song Card", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mockSingerCharacter],
      hand: [mockSongCard],
    });

    const { singer, song } = testEngine.singSong({
      song: mockSongCard,
      singer: mockSingerCharacter,
    });

    expect(singer.zone).toEqual("play");
    expect(singer.isExerted).toEqual(true);
    expect(song.zone).toEqual("discard");
  });

  it("Does not Sing a Song Card, if character doesn't have enough cost", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mockCharacter], // Use the weak character that can't sing the song
      hand: [mockSongCard],
    });

    const { singer, song, result } = testEngine.singSong({
      song: mockSongCard,
      singer: mockCharacter,
    });

    expect(result.success).toBeFalsy();
    expect(singer.zone).toEqual("play");
    expect(singer.isExerted).toEqual(false);
    expect(song.zone).toEqual("hand");
  });
});
