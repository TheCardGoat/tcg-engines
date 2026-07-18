import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { winnieThePoohHunnyArchmage } from "./040-winnie-the-pooh-hunny-archmage";
import { pigletHunnyMageApprentice } from "./154-piglet-hunny-mage-apprentice";
import { winnieThePoohPigletHunnyMages } from "./062-winnie-the-pooh-piglet-hunny-mages";

describe("Winnie the Pooh & Piglet - Hunny Mages", () => {
  it("can shift onto a character named Piglet", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [winnieThePoohPigletHunnyMages],
      play: [pigletHunnyMageApprentice],
      inkwell: 3,
    });
    const player = testEngine.asPlayerOne();
    const cardId = testEngine.findCardInstanceId(
      winnieThePoohPigletHunnyMages,
      "hand",
      PLAYER_ONE,
    );
    const shiftTarget = testEngine.findCardInstanceId(
      pigletHunnyMageApprentice,
      "play",
      PLAYER_ONE,
    );

    expect(player.getShiftPlayDisabledReason(cardId)).toBeNull();
    expect(player.getMoveOptions("shiftCard", cardId)).toContainEqual({
      kind: "card",
      cardId: shiftTarget,
    });
    expect(
      player.playCard(winnieThePoohPigletHunnyMages, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(player.getCardZone(winnieThePoohPigletHunnyMages)).toBe("play");
    expect(testEngine.getCardsUnder(winnieThePoohPigletHunnyMages)).toEqual([shiftTarget]);
  });

  it("can shift onto a character named Winnie the Pooh", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [winnieThePoohPigletHunnyMages],
      play: [winnieThePoohHunnyArchmage],
      inkwell: 3,
    });
    const player = testEngine.asPlayerOne();
    const cardId = testEngine.findCardInstanceId(
      winnieThePoohPigletHunnyMages,
      "hand",
      PLAYER_ONE,
    );
    const shiftTarget = testEngine.findCardInstanceId(
      winnieThePoohHunnyArchmage,
      "play",
      PLAYER_ONE,
    );

    expect(player.getShiftPlayDisabledReason(cardId)).toBeNull();
    expect(player.getMoveOptions("shiftCard", cardId)).toContainEqual({
      kind: "card",
      cardId: shiftTarget,
    });
    expect(
      player.playCard(winnieThePoohPigletHunnyMages, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(player.getCardZone(winnieThePoohPigletHunnyMages)).toBe("play");
    expect(testEngine.getCardsUnder(winnieThePoohPigletHunnyMages)).toEqual([shiftTarget]);
  });
});
