/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { andThenAlongCameZeus } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { iagoGiantSpectralParrot } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Iago - Giant Spectral Parrot", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [iagoGiantSpectralParrot],
    });

    const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
    const testEngine = new TestEngine({
      play: [iagoGiantSpectralParrot],
    });

    const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});

describe("Regression", () => {
  it("should vanish when hitted by and the came along zeus", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: andThenAlongCameZeus.cost,
        hand: [andThenAlongCameZeus],
      },
      {
        play: [iagoGiantSpectralParrot],
      },
    );

    await testEngine.playCard(andThenAlongCameZeus, {
      targets: [iagoGiantSpectralParrot],
    });

    expect(testEngine.getCardModel(iagoGiantSpectralParrot).zone).toBe(
      "discard",
    );
  });
});
