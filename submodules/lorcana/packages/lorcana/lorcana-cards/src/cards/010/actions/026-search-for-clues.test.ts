import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { basilTenaciousMouse } from "../characters";
import { mickeyMouseTrueFriend, moanaOfMotunui, simbaProtectiveCub } from "../../001/characters";
import { searchForClues } from "./026-search-for-clues";

describe("Search for Clues", () => {
  it("makes the only player with the largest hand discard 2 and gains lore if you control a Detective", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [searchForClues],
        inkwell: searchForClues.cost,
        play: [basilTenaciousMouse],
      },
      {
        hand: [mickeyMouseTrueFriend, simbaProtectiveCub, moanaOfMotunui],
      },
    );

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(playerOne.playCard(searchForClues)).toBeSuccessfulCommand();
    expect(
      playerTwo.respondWith(mickeyMouseTrueFriend, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    expect(playerOne.getLore(PLAYER_ONE)).toBe(1);
    expect(playerTwo).toHaveZoneCounts({ hand: 1, discard: 2 });
  });

  it("makes both players discard when the largest hand count is tied above zero", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [searchForClues, basilTenaciousMouse, simbaProtectiveCub],
        inkwell: searchForClues.cost,
      },
      {
        hand: [mickeyMouseTrueFriend, moanaOfMotunui],
      },
    );

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(playerOne.playCard(searchForClues)).toBeSuccessfulCommand();
    expect(playerOne.respondWith(basilTenaciousMouse, simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(playerTwo.respondWith(mickeyMouseTrueFriend, moanaOfMotunui)).toBeSuccessfulCommand();

    expect(playerOne).toHaveZoneCounts({ hand: 0, discard: 3 });
    expect(playerTwo).toHaveZoneCounts({ hand: 0, discard: 2 });
    expect(playerOne.getLore(PLAYER_ONE)).toBe(0);
  });

  it("does not create discard choices when no player has cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [searchForClues],
        inkwell: searchForClues.cost,
      },
      {
        hand: 0,
      },
    );

    const playerOne = testEngine.asPlayerOne();

    expect(playerOne.playCard(searchForClues)).toBeSuccessfulCommand();
    expect(playerOne.getPendingEffects()).toHaveLength(0);
    expect(playerOne.getLore(PLAYER_ONE)).toBe(0);
  });
});
