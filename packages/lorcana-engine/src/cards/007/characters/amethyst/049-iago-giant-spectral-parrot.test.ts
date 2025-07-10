/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { iagoGiantSpectralParrot } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
