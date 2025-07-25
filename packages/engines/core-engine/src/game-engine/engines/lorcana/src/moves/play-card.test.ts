import { describe, expect, it } from "bun:test";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { fangRiverCity } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { unconventionalTool } from "@lorcanito/lorcana-engine/cards/007";
import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { playCardMove } from "~/game-engine/engines/lorcana/src/moves/play-card";
import type { LorcanaMoveFn } from "~/game-engine/engines/lorcana/src/moves/types";
import { LorcanaTestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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

      const result = (playCardMove as LorcanaMoveFn)(
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
});
