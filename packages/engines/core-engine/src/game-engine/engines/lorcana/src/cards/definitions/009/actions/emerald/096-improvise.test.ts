/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { improvise } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Improvise", () => {
  it.skip("Chosen character gets +1 {S} this turn. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: improvise.cost,
      play: [improvise],
      hand: [improvise],
    });

    await testEngine.playCard(improvise);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
