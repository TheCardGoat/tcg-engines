import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { snowWhiteLostInTheForest } from "./023-snow-white-lost-in-the-forest";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Snow White - Lost in the Forest", () => {
  it("I WON'T HURT YOU - removes up to 2 damage from chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: gastonBaritoneBully, damage: 3 }],
      hand: [{ card: snowWhiteLostInTheForest }],
      inkwell: Array.from({ length: 5 }).map(() => ({ card: gastonBaritoneBully })),
    });

    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");

    expect(testEngine.asPlayerOne().playCard(snowWhiteLostInTheForest)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(snowWhiteLostInTheForest),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [gastonId] }),
    ).toBeSuccessfulCommand();

    const gaston = testEngine.asServer().getCard(gastonId);
    expect(gaston.damage).toBe(1); // 3 - 2 = 1
  });

  it("I WON'T HURT YOU - player may decline the optional effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: gastonBaritoneBully, damage: 3 }],
      hand: [{ card: snowWhiteLostInTheForest }],
      inkwell: Array.from({ length: 5 }).map(() => ({ card: gastonBaritoneBully })),
    });

    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");

    expect(testEngine.asPlayerOne().playCard(snowWhiteLostInTheForest)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(snowWhiteLostInTheForest, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Damage is unchanged because the player declined the optional
    const gaston = testEngine.asServer().getCard(gastonId);
    expect(gaston.damage).toBe(3);
  });
});
