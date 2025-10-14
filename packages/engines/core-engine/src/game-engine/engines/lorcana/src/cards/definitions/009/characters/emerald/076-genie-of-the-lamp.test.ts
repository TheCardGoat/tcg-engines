import { describe, expect, it } from "bun:test";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { genieOfTheLamp } from "./076-genie-of-the-lamp";

describe("Genie - Of the Lamp", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [genieOfTheLamp],
    });

    const cardUnderTest = testEngine.getCardModel(genieOfTheLamp);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("LET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: genieOfTheLamp.cost,
      play: [genieOfTheLamp, deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(genieOfTheLamp);
    const targetCard = testEngine.getCardModel(deweyLovableShowoff);

    expect(targetCard.strength).toBe(deweyLovableShowoff.strength);

    await testEngine.exertCard(cardUnderTest);

    expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);
    expect(cardUnderTest.strength).toBe(genieOfTheLamp.strength);

    await testEngine.passTurn();

    expect(cardUnderTest.ready).toBe(false);
    expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);

    // Turn ends, Genie is ready again
    await testEngine.passTurn();

    expect(cardUnderTest.ready).toBe(true);
    expect(targetCard.strength).toBe(deweyLovableShowoff.strength);

    await testEngine.exertCard(cardUnderTest);
    expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);

    await testEngine.passTurn();

    expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);

    cardUnderTest.banish();
    expect(cardUnderTest.zone).toBe("discard");
    expect(targetCard.strength).toBe(deweyLovableShowoff.strength);
  });
});
