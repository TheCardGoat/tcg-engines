/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { grandmotherFaSpiritedElder } from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Grandmother Fa - Spirited Elder", () => {
  it.skip("I HAVE ALL THE LUCK WE NEED Each time this character is sent on an adventure, you can choose one of your characters to gain +2 {S} for the rest of the turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: grandmotherFaSpiritedElder.cost,
      play: [grandmotherFaSpiritedElder],
      hand: [grandmotherFaSpiritedElder],
    });

    await testEngine.playCard(grandmotherFaSpiritedElder);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
