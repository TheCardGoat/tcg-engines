/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { paniqueTenseImp } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Panique - Tense Imp", () => {
  it.skip("FRIGHTENED SCREAM When you play this character, you can choose a character and move up to 2 of its damage to an opposing character of your choice.", async () => {
    const testEngine = new TestEngine({
      inkwell: paniqueTenseImp.cost,
      hand: [paniqueTenseImp],
    });

    await testEngine.playCard(paniqueTenseImp);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
