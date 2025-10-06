/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { deweyShowyNephew } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { yzmaUnjustlyTreated } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  charlotteLaBouffMardiGrasPrincess,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Yzma - Unjustly Treated", () => {
  it("**I'M WARNING YOU!** During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.", () => {
    const testEngine = new TestEngine(
      {
        inkwell: yzmaUnjustlyTreated.cost,
        play: [yzmaUnjustlyTreated, deweyLovableShowoff],
      },
      {
        play: [deweyShowyNephew, charlotteLaBouffMardiGrasPrincess],
      },
    );

    const cardUnderTest = testEngine.getCardModel(yzmaUnjustlyTreated);
    const oppoChalleng = testEngine.getCardModel(deweyShowyNephew);
    const targetEffect = testEngine.getCardModel(
      charlotteLaBouffMardiGrasPrincess,
    );
    const attacker = testEngine.getCardModel(deweyLovableShowoff);

    oppoChalleng.exert();

    testEngine.challenge({
      attacker: attacker,
      defender: oppoChalleng,
    });

    // Verify the opponent's character is banished
    expect(oppoChalleng.zone).toEqual("discard");

    // Resolve Yzma's triggered ability
    testEngine.resolveOptionalAbility();
    testEngine.resolveTopOfStack({ targets: [targetEffect] });

    // Target should receive 1 damage
    expect(targetEffect.damage).toEqual(1);
  });

  it("**I'M WARNING YOU!** Does not trigger when your character is banished", () => {
    const testEngine = new TestEngine(
      {
        inkwell: yzmaUnjustlyTreated.cost,
        play: [yzmaUnjustlyTreated, deweyShowyNephew],
      },
      {
        play: [deweyLovableShowoff, charlotteLaBouffMardiGrasPrincess],
      },
    );

    const cardUnderTest = testEngine.getCardModel(yzmaUnjustlyTreated);
    const oppoChalleng = testEngine.getCardModel(deweyLovableShowoff);
    const targetEffect = testEngine.getCardModel(
      charlotteLaBouffMardiGrasPrincess,
    );
    const attacker = testEngine.getCardModel(deweyShowyNephew);

    oppoChalleng.exert();

    testEngine.challenge({
      attacker: attacker,
      defender: oppoChalleng,
    });

    // Verify our character is banished instead of opponent's
    expect(attacker.zone).toEqual("discard");

    // No ability should trigger, stack should be empty
    expect(testEngine.stackLayers.length).toEqual(0);

    // Target should not receive damage
    expect(targetEffect.damage).toEqual(0);
  });

  it("**I'M WARNING YOU!** Does not trigger during opponent's turn", () => {
    const testEngine = new TestEngine(
      {
        inkwell: yzmaUnjustlyTreated.cost,
        play: [yzmaUnjustlyTreated, deweyShowyNephew],
      },
      {
        play: [deweyLovableShowoff, charlotteLaBouffMardiGrasPrincess],
      },
    );

    const cardUnderTest = testEngine.getCardModel(yzmaUnjustlyTreated);
    const oppoChalleng = testEngine.getCardModel(deweyShowyNephew);
    const targetEffect = testEngine.getCardModel(
      charlotteLaBouffMardiGrasPrincess,
    );
    const attacker = testEngine.getCardModel(deweyLovableShowoff);

    // Pass turn to opponent
    testEngine.passTurn();

    oppoChalleng.exert();

    testEngine.challenge({
      attacker: attacker,
      defender: oppoChalleng,
    });

    // Verify opponent's attack banishes our character
    expect(oppoChalleng.zone).toEqual("discard");

    // No ability should trigger, stack should be empty
    expect(testEngine.stackLayers.length).toEqual(0);

    // Target should not receive damage
    expect(targetEffect.damage).toEqual(0);
  });
});
