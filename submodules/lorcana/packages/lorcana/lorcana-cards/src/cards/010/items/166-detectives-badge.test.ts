import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { detectivesBadge } from "./166-detectives-badge";

describe("Detective's Badge", () => {
  it("PROTECT AND SERVE - gives the chosen character Resist +1 and Detective until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [detectivesBadge, mickeyMouseTrueFriend],
      inkwell: 1,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(detectivesBadge, {
        ability: "PROTECT AND SERVE",
        targets: [mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(mickeyMouseTrueFriend, "Resist")).toBe(1);
    expect(testEngine.getCard(mickeyMouseTrueFriend).classifications?.includes("Detective")).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(mickeyMouseTrueFriend, "Resist")).toBe(1);
    expect(testEngine.getCard(mickeyMouseTrueFriend).classifications?.includes("Detective")).toBe(
      true,
    );

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(mickeyMouseTrueFriend, "Resist")).toBeNull();
    expect(testEngine.getCard(mickeyMouseTrueFriend).classifications?.includes("Detective")).toBe(
      false,
    );
  });
});
