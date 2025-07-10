/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  deweyLovableShowoff,
  lenaSabrewingPureEnergy,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
