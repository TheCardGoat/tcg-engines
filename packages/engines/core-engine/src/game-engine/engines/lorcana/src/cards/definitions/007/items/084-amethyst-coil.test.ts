/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  amethystCoil,
  kodaSmallishBear,
  sirKayUnrulyKnight,
  suzyMasterSeamstress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Amethyst Coil", () => {
  it("MAGICAL TOUCH During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine(
      {
        play: [amethystCoil, sirKayUnrulyKnight],
        hand: [suzyMasterSeamstress],
      },
      {
        play: [kodaSmallishBear],
      },
    );

    await testEngine.setCardDamage(sirKayUnrulyKnight, 1);
    await testEngine.putIntoInkwell(suzyMasterSeamstress);

    expect(testEngine.getCardModel(sirKayUnrulyKnight).damage).toBe(1);
    expect(testEngine.getCardModel(kodaSmallishBear).damage).toBe(0);

    await testEngine.acceptOptionalAbility();
    await testEngine.resolveTopOfStack(
      {
        targets: [sirKayUnrulyKnight],
      },
      true,
    );
    await testEngine.resolveTopOfStack({
      targets: [kodaSmallishBear],
    });

    expect(testEngine.getCardModel(sirKayUnrulyKnight).damage).toBe(0);
    expect(testEngine.getCardModel(kodaSmallishBear).damage).toBe(1);
  });
});
