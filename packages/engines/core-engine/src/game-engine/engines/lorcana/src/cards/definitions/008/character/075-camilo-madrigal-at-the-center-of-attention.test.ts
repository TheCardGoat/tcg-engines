/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  camiloMadrigalAtTheCenterOfAttention,
  theSultanRoyalApparition,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Camilo Madrigal - At the Center of Attention", () => {
  it("BIS! BIS! When this character is banished in a challenge, return this card to your hand.", async () => {
    const testEngine = new TestEngine(
      {
        play: [camiloMadrigalAtTheCenterOfAttention],
      },
      {
        play: [theSultanRoyalApparition],
      },
    );

    await testEngine.challenge({
      attacker: camiloMadrigalAtTheCenterOfAttention,
      defender: theSultanRoyalApparition,
      exertDefender: true,
    });

    expect(
      testEngine.getCardModel(camiloMadrigalAtTheCenterOfAttention).zone,
    ).toEqual("hand");
  });
});
