import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../characters";
import { scepterOfArendelle } from "./170-scepter-of-arendelle";

describe("Scepter of Arendelle", () => {
  it("gives the chosen character Support for the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [scepterOfArendelle, mickeyMouseTrueFriend],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(scepterOfArendelle, {
      ability: "COMMAND",
      targets: [mickeyMouseTrueFriend],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(scepterOfArendelle)).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseTrueFriend, "Support")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseTrueFriend, "Support")).toBe(false);
  });
});
