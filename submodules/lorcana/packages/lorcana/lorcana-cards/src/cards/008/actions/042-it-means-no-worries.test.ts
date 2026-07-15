import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  heiheiBoatSnack,
  mickeyMouseArtfulRogue,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "../../001";
import { itMeansNoWorries } from "./042-it-means-no-worries";

describe("It Means No Worries", () => {
  it("returns up to 3 character cards from your discard and reduces the next character you play this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [itMeansNoWorries, heiheiBoatSnack],
      inkwell: 10,
      discard: [mickeyMouseTrueFriend, simbaProtectiveCub, mickeyMouseArtfulRogue],
    });

    expect(
      testEngine.asPlayerOne().playCard(itMeansNoWorries, {
        targets: [mickeyMouseTrueFriend, simbaProtectiveCub, mickeyMouseArtfulRogue],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseArtfulRogue)).toBe("hand");

    expect(testEngine.asPlayerOne().playCard(heiheiBoatSnack)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("play");
  });
});
