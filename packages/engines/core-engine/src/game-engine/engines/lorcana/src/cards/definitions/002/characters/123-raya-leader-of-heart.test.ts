import { describe, expect, it } from "bun:test";
import { rayaLeaderOfHeart } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008/character";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Raya - Leader of Heart", () => {
  it("Shift", () => {
    const testStore = new TestEngine({
      play: [rayaLeaderOfHeart],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      rayaLeaderOfHeart.id,
    );

    expect(cardUnderTest.hasShift()).toEqual(true);
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

    // This test should check that the card goes to discard since the target is not damaged
    expect(cardUnderTest.zone).toEqual("discard");
  });

  it("**CHAMPION OF KUMANDRA** Damaged character target.", () => {
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

    // Raya should stay in play when challenging a damaged character
    expect(cardUnderTest.zone).toEqual("play");

    // And should take no damage from the challenge
    expect(cardUnderTest.damage).toEqual(0);
  });
});
