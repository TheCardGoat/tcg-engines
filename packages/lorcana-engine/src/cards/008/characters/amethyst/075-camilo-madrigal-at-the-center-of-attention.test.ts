/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  camiloMadrigalAtTheCenterOfAttention,
  theSultanRoyalApparition,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
