import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack } from "../../001";
import { lantern } from "./032-lantern";

describe("Lantern", () => {
  it("reduces the cost of the next character you play this turn by 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [heiheiBoatSnack],
      inkwell: heiheiBoatSnack.cost - 1,
      play: [lantern],
    });

    expect(testEngine.asPlayerOne().canPlayCard(heiheiBoatSnack)).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(lantern, {
        ability: "BIRTHDAY LIGHTS",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canPlayCard(heiheiBoatSnack)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(heiheiBoatSnack)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(lantern)).toBe(true);
  });
});
