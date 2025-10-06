/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tinkerBellTinyTactician } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Tinker Bell - Tiny Tactician", () => {
  it.skip("**Battle plans** {E} - Draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: tinkerBellTinyTactician.cost,
      play: [tinkerBellTinyTactician],
      hand: [tinkerBellTinyTactician],
    });

    await testEngine.playCard(tinkerBellTinyTactician);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
