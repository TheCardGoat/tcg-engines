import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { balooFriendAndGuardian, mickeyMouseAmberChampion } from "../characters";
import { duckburgFunsosFunzone } from "../locations";
import { theGamesAfoot } from "./198-the-games-afoot";

describe("The Game's Afoot!", () => {
  it("moves up to 2 characters to the chosen location and grants Resist +2 until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theGamesAfoot],
      inkwell: theGamesAfoot.cost,
      play: [duckburgFunsosFunzone, mickeyMouseAmberChampion, balooFriendAndGuardian],
    });

    const playerOne = testEngine.asPlayerOne();

    expect(
      playerOne.playCard(theGamesAfoot, {
        targets: [mickeyMouseAmberChampion, balooFriendAndGuardian, duckburgFunsosFunzone],
      }).success,
    ).toBe(true);

    expect(playerOne).toBeAtLocation({
      card: mickeyMouseAmberChampion,
      location: duckburgFunsosFunzone,
    });
    expect(playerOne).toBeAtLocation({
      card: balooFriendAndGuardian,
      location: duckburgFunsosFunzone,
    });
    expect(playerOne).toHaveKeyword({
      card: duckburgFunsosFunzone,
      keyword: "Resist",
      value: 2,
    });
  });

  it("allows moving zero characters and still buffs the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theGamesAfoot],
      inkwell: theGamesAfoot.cost,
      play: [duckburgFunsosFunzone, mickeyMouseAmberChampion],
    });

    const playerOne = testEngine.asPlayerOne();

    expect(
      playerOne.playCard(theGamesAfoot, {
        targets: [duckburgFunsosFunzone],
      }).success,
    ).toBe(true);

    expect(playerOne).toHaveKeyword({
      card: duckburgFunsosFunzone,
      keyword: "Resist",
      value: 2,
    });
    expect(playerOne).not.toBeAtLocation({
      card: mickeyMouseAmberChampion,
      location: duckburgFunsosFunzone,
    });
  });

  it("expires the location Resist bonus at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theGamesAfoot],
      inkwell: theGamesAfoot.cost,
      play: [duckburgFunsosFunzone, mickeyMouseAmberChampion],
    });

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(
      playerOne.playCard(theGamesAfoot, {
        targets: [mickeyMouseAmberChampion, duckburgFunsosFunzone],
      }).success,
    ).toBe(true);

    expect(playerOne).toHaveKeyword({
      card: duckburgFunsosFunzone,
      keyword: "Resist",
      value: 2,
    });

    expect(playerOne.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo).toHaveKeyword({
      card: duckburgFunsosFunzone,
      keyword: "Resist",
      value: 2,
    });

    expect(playerTwo.passTurn()).toBeSuccessfulCommand();
    expect(playerOne).not.toHaveKeyword({
      card: duckburgFunsosFunzone,
      keyword: "Resist",
    });
  });
});
