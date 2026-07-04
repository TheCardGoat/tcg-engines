import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { morphLittleImitator } from "./057-morph-little-imitator";
import { theHornedKingMercilessMaster } from "./022-the-horned-king-merciless-master";
import { sulleyBooScareBuddies } from "./029-sulley-boo-scare-buddies";

const discardCharacter = createMockCharacter({
  id: "horned-king-cauldron-power-discard-character",
  name: "Cauldron Recruit",
  cost: 2,
});

describe("The Horned King - Merciless Master", () => {
  it("plays a character from discard for its normal cost and that character enters exerted while he is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: theHornedKingMercilessMaster, exerted: true }],
      discard: [discardCharacter],
      inkwell: discardCharacter.cost,
    });
    const discardCharacterId = testEngine.findCardInstanceId(
      discardCharacter,
      "discard",
      PLAYER_ONE,
    );

    expect(testEngine.asPlayerOne().playCard(discardCharacterId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardCharacterId)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(discardCharacterId)).toBe(true);
  });

  it("surfaces playable discard characters in available moves while he is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: theHornedKingMercilessMaster, exerted: true }],
      discard: [discardCharacter],
      inkwell: discardCharacter.cost,
    });
    const discardCharacterId = testEngine.findCardInstanceId(
      discardCharacter,
      "discard",
      PLAYER_ONE,
    );

    const playMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "playCard");

    expect(playMove?.selectableCardIds).toContain(discardCharacterId);
  });

  it("surfaces Shift-only discard characters as Shift moves while he is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: theHornedKingMercilessMaster, exerted: true }, morphLittleImitator],
      discard: [sulleyBooScareBuddies],
      inkwell: 4,
    });
    const discardShiftCardId = testEngine.findCardInstanceId(
      sulleyBooScareBuddies,
      "discard",
      PLAYER_ONE,
    );

    const moves = testEngine.asPlayerOne().getAvailableMoves();
    const playMove = moves.find((move) => move.moveId === "playCard");
    const shiftMove = moves.find((move) => move.moveId === "shiftCard");

    expect(playMove?.selectableCardIds ?? []).not.toContain(discardShiftCardId);
    expect(shiftMove?.selectableCardIds).toContain(discardShiftCardId);
  });
});
