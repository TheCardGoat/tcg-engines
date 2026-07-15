import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kristoffsLute } from "./133-kristoffs-lute";

const inspiredSinger = createMockCharacter({
  id: "kristoffs-lute-inspired-singer",
  name: "Inspired Singer",
  cost: 1,
});

const discardedBallad = createMockCharacter({
  id: "kristoffs-lute-discarded-ballad",
  name: "Discarded Ballad",
  cost: 1,
});

describe("Kristoff's Lute", () => {
  it("can play the revealed top card as if it were in your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [inspiredSinger],
      inkwell: 3,
      play: [kristoffsLute],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(kristoffsLute, {
        choiceIndex: 0,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(inspiredSinger)).toBe("play");
  });

  it("puts the revealed card into your discard when you choose not to play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [discardedBallad],
      inkwell: 2,
      play: [kristoffsLute],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(kristoffsLute, {
        choiceIndex: 1,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardedBallad)).toBe("discard");
  });
});
