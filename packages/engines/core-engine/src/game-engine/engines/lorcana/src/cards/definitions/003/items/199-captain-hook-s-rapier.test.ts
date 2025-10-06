/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { captainHooksRapier } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/index";
import { captainHookUnderhanded } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Captain Hook’s Rapier", () => {
  it("**GET THOSE SCURVY BRATS!** During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.**LET’S HAVE AT IT!</** Your characters named Captain Hook gain **Challenger** +1. _(They get +1 {S} while challenging.)_", () => {
    const testEngine = new TestEngine(
      {
        inkwell: captainHooksRapier.cost + 1,
        play: [captainHooksRapier, deweyLovableShowoff],
      },
      {
        play: [captainHookUnderhanded],
      },
    );

    const cardUnderTest = testEngine.getCardModel(captainHooksRapier);
    const attacker = testEngine.getCardModel(deweyLovableShowoff);
    const defender = testEngine.getCardModel(captainHookUnderhanded);

    defender.exert();

    testEngine.challenge({
      attacker: attacker,
      defender: defender,
    });

    expect(defender.zone).toBe("discard");
    testEngine.resolveOptionalAbility();
    expect(testEngine.getCardsByZone("hand").length).toBe(1);

    // testEngine.resolveOptionalAbility();
    // testEngine.resolveTopOfStack({});
  });
});
