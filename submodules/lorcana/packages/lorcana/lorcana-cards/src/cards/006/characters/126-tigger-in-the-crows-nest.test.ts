import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aVeryMerryUnbirthday } from "../actions/060-a-very-merry-unbirthday";
import { tiggerInTheCrowsNest } from "./126-tigger-in-the-crows-nest";

describe("Tigger - In the Crow's Nest", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tiggerInTheCrowsNest],
      deck: 1,
    });

    const tiggerInstanceId = testEngine.findCardInstanceId(tiggerInTheCrowsNest, "play");
    expect(testEngine.asServer().getCard(tiggerInstanceId).hasEvasive).toBe(true);
  });

  it("SWASH YOUR BUCKLES - gets +1 strength and +1 lore when an action is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tiggerInTheCrowsNest],
        hand: [aVeryMerryUnbirthday],
        inkwell: aVeryMerryUnbirthday.cost,
      },
      {
        deck: 5,
      },
    );

    const tiggerInstanceId = testEngine.findCardInstanceId(tiggerInTheCrowsNest, "play");

    expect(testEngine.asServer().getCard(tiggerInstanceId).strength).toBe(
      tiggerInTheCrowsNest.strength,
    );
    expect(testEngine.asServer().getCard(tiggerInstanceId).lore).toBe(tiggerInTheCrowsNest.lore);

    expect(testEngine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();

    expect(testEngine.asServer().getCard(tiggerInstanceId).strength).toBe(
      tiggerInTheCrowsNest.strength + 1,
    );
    expect(testEngine.asServer().getCard(tiggerInstanceId).lore).toBe(
      tiggerInTheCrowsNest.lore + 1,
    );
  });

  it("SWASH YOUR BUCKLES - buff expires at the end of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tiggerInTheCrowsNest],
        hand: [aVeryMerryUnbirthday],
        inkwell: aVeryMerryUnbirthday.cost,
      },
      {
        deck: 5,
      },
    );

    const tiggerInstanceId = testEngine.findCardInstanceId(tiggerInTheCrowsNest, "play");

    expect(testEngine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();

    expect(testEngine.asServer().getCard(tiggerInstanceId).strength).toBe(
      tiggerInTheCrowsNest.strength + 1,
    );
    expect(testEngine.asServer().getCard(tiggerInstanceId).lore).toBe(
      tiggerInTheCrowsNest.lore + 1,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asServer().getCard(tiggerInstanceId).strength).toBe(
      tiggerInTheCrowsNest.strength,
    );
    expect(testEngine.asServer().getCard(tiggerInstanceId).lore).toBe(tiggerInTheCrowsNest.lore);
  });

  it("SWASH YOUR BUCKLES - stacks with multiple actions played in one turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tiggerInTheCrowsNest],
        hand: [aVeryMerryUnbirthday],
        inkwell: 10,
      },
      {
        deck: 10,
      },
    );

    const tiggerInstanceId = testEngine.findCardInstanceId(tiggerInTheCrowsNest, "play");

    expect(testEngine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();

    expect(testEngine.asServer().getCard(tiggerInstanceId).strength).toBe(
      tiggerInTheCrowsNest.strength + 1,
    );
    expect(testEngine.asServer().getCard(tiggerInstanceId).lore).toBe(
      tiggerInTheCrowsNest.lore + 1,
    );
  });
});
