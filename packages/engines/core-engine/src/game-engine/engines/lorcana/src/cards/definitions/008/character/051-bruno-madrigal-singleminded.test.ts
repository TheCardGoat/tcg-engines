import { describe, expect, it } from "bun:test";
import {
  brunoMadrigalSingleminded,
  camiloMadrigalAtTheCenterOfAttention,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bruno Madrigal - Single-Minded", () => {
  it("STANDING TALL When you play this character, chosen opposing character can’t ready at the start of their next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: brunoMadrigalSingleminded.cost,
        hand: [brunoMadrigalSingleminded],
      },
      {
        play: [camiloMadrigalAtTheCenterOfAttention],
      },
    );

    await testEngine.exertCard(camiloMadrigalAtTheCenterOfAttention);

    await testEngine.playCard(brunoMadrigalSingleminded, {
      targets: [camiloMadrigalAtTheCenterOfAttention],
    });

    await testEngine.passTurn();

    expect(
      testEngine.getCardModel(camiloMadrigalAtTheCenterOfAttention).exerted,
    ).toBe(true);
  });
});
