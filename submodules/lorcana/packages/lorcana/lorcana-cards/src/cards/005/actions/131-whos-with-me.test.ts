import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { arthurNoviceSparrow } from "../characters";
import { whosWithMe } from "./131-whos-with-me";

describe("Who's With Me?", () => {
  it("gives your characters +2 strength and gains 2 lore when your Reckless character challenges another character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [whosWithMe],
        inkwell: whosWithMe.cost,
        play: [arthurNoviceSparrow],
      },
      {
        play: [{ card: simbaProtectiveCub, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(whosWithMe)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(arthurNoviceSparrow)).toBe(
      arthurNoviceSparrow.strength + 2,
    );

    expect(
      testEngine.asPlayerOne().challenge(arthurNoviceSparrow, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });
});
