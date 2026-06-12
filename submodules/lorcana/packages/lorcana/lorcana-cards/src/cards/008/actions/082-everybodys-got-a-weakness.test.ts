import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  mickeyMouseArtfulRogue,
  mickeyMouseDetective,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "../../001";
import { goofyKnightForADay } from "../../002";
import { everybodysGotAWeakness } from "./082-everybodys-got-a-weakness";

describe("Everybody's Got a Weakness", () => {
  it("moves 1 damage from each of your damaged characters and draws that many cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [everybodysGotAWeakness],
        inkwell: everybodysGotAWeakness.cost,
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
        deck: [mickeyMouseArtfulRogue, mickeyMouseDetective],
      },
      {
        play: [goofyKnightForADay],
      },
    );
    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 1)).toBeSuccessfulCommand();

    expect(
      playerOne.playCard(everybodysGotAWeakness, { targets: [goofyKnightForADay] }).success,
    ).toBe(true);

    expect(playerOne.getDamage(simbaProtectiveCub)).toBe(1);
    expect(playerOne.getDamage(mickeyMouseTrueFriend)).toBe(0);
    expect(playerTwo.getDamage(goofyKnightForADay)).toBe(2);
    expect(playerOne.getZonesCardCount().hand).toBe(2);
  });
});
