import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { abbyParkOverTheTop } from "./014-abby-park-over-the-top";

const abbySong = createMockSong({
  id: "abby-park-song",
  name: "Abby Park Song",
  cost: 1,
  text: "A song for Abby.",
});

describe("Abby Park - Over the Top", () => {
  it("readies when you play a song and cannot quest or challenge for the rest of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [abbySong],
      inkwell: abbySong.cost,
      play: [{ card: abbyParkOverTheTop, exerted: true, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().playCard(abbySong)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(abbyParkOverTheTop, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(abbyParkOverTheTop)).toBe(false);
    expect(
      testEngine
        .asPlayerOne()
        .hasTemporaryRestriction(abbyParkOverTheTop, "cant-quest-or-challenge"),
    ).toBe(true);
  });
});
