import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { healingGlow, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { aVeryMerryUnbirthday } from "./060-a-very-merry-unbirthday";

describe("A Very Merry Unbirthday", () => {
  it("mills the top 2 cards of each opponent's deck into their discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aVeryMerryUnbirthday],
        inkwell: aVeryMerryUnbirthday.cost,
      },
      {
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend, healingGlow],
      },
    );

    expect(testEngine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(1);
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(2);
  });

  it("is a song that can be sung by a character with cost 1 or more", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aVeryMerryUnbirthday],
        play: [simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend, healingGlow],
      },
    );

    // Simba (cost 2) should be able to sing this song (cost 1)
    expect(testEngine.asPlayerOne().canPlayCard(aVeryMerryUnbirthday)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(true);
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(2);
  });

  it("does nothing when opponent deck has fewer than 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aVeryMerryUnbirthday],
        inkwell: aVeryMerryUnbirthday.cost,
      },
      {
        deck: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(0);
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
  });
});
