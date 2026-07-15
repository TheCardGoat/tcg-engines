import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { soMuchToGive } from "./038-so-much-to-give";

describe("So Much to Give", () => {
  it("draws a card and grants Bodyguard until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [soMuchToGive],
        inkwell: soMuchToGive.cost,
        play: [arielOnHumanLegs],
        deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(soMuchToGive, {
        targets: [arielOnHumanLegs],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Bodyguard")).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Bodyguard")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Bodyguard")).toBe(false);
  });
});
