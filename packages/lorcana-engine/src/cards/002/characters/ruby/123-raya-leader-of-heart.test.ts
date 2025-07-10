/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rayaLeaderOfHeart } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Raya - Leader of Heart", () => {
  it("Shift", () => {
    const testStore = new TestEngine({
      play: [rayaLeaderOfHeart],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      rayaLeaderOfHeart.id,
    );

    expect(cardUnderTest.hasShift).toEqual(true);
  });

  it("**CHAMPION OF KUMANDRA** Whenever this character challenges a damaged character, she takes no damage from the challenge.", () => {
    const testEngine = new TestEngine(
      {
        play: [rayaLeaderOfHeart],
      },
      { play: [deweyLovableShowoff] },
    );

    const cardUnderTest = testEngine.getCardModel(rayaLeaderOfHeart);

    const target = testEngine.getCardModel(deweyLovableShowoff);

    target.exert();

    testEngine.challenge({
      attacker: cardUnderTest,
      defender: target,
    });

    expect(cardUnderTest.zone).toEqual("discard");

    //expect(cardUnderTest.hasShift).toEqual(true);
  });

  it("**CHAMPION OF KUMANDRA** Damaged caracther target.", () => {
    const testEngine = new TestEngine(
      {
        play: [rayaLeaderOfHeart],
      },
      { play: [deweyLovableShowoff] },
    );

    const cardUnderTest = testEngine.getCardModel(rayaLeaderOfHeart);

    const target = testEngine.getCardModel(deweyLovableShowoff);

    target.exert();
    target.damage = 1;

    testEngine.challenge({
      attacker: cardUnderTest,
      defender: target,
    });

    expect(cardUnderTest.zone).toEqual("play");

    expect(cardUnderTest.damage).toEqual(0);

    //expect(cardUnderTest.hasShift).toEqual(true);
  });
});
