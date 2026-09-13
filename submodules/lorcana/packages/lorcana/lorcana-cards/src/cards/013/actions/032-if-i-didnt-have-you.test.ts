import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, arielOnHumanLegs, healingGlow, simbaProtectiveCub } from "../../001";
import { ifIDidntHaveYou } from "./032-if-i-didnt-have-you";

describe("If I Didn't Have You", () => {
  it("has you and another chosen player each draw 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ifIDidntHaveYou],
        inkwell: ifIDidntHaveYou.cost,
        deck: [aladdinPrinceAli, arielOnHumanLegs],
      },
      {
        deck: [healingGlow, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(ifIDidntHaveYou)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(2);
  });

  it("does not allow the controller to be the other chosen player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ifIDidntHaveYou],
        inkwell: ifIDidntHaveYou.cost,
        deck: [aladdinPrinceAli, arielOnHumanLegs],
      },
      {
        deck: [healingGlow, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCardForPlayer(ifIDidntHaveYou, PLAYER_ONE)).toMatchObject({
      success: false,
      errorCode: "INVALID_ACTION_TARGET",
    });

    expect(testEngine.asPlayerOne().getCardZone(ifIDidntHaveYou)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(0);
  });
});
