/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { fireTheCannons } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Fire the Cannons!", () => {
  it.skip("Deal 2 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: fireTheCannons.cost,
      play: [fireTheCannons],
      hand: [fireTheCannons],
    });

    await testEngine.playCard(fireTheCannons);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
