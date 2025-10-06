/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { plutoRescueDog } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Pluto - Rescue Dog", () => {
  it.skip("**TO THE RESCUE** When you play this character, you may remove up to 3 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: plutoRescueDog.cost,
      hand: [plutoRescueDog],
    });

    await testEngine.playCard(plutoRescueDog);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
