import { describe, expect, it } from "bun:test";
import {
  deweyLovableShowoff,
  lenaSabrewingPureEnergy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lena Sabrewing - Pure Energy", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [lenaSabrewingPureEnergy],
    });

    const cardUnderTest = testEngine.getCardModel(lenaSabrewingPureEnergy);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("SUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        play: [lenaSabrewingPureEnergy],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(lenaSabrewingPureEnergy);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.activateCard(cardUnderTest, {
      ability: "SUPERNATURAL VENGEANCE",
      targets: [target],
    });

    expect(target.damage).toBe(1);
  });
});
