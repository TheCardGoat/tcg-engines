/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  brunoMadrigalSingleminded,
  camiloMadrigalAtTheCenterOfAttention,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

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
