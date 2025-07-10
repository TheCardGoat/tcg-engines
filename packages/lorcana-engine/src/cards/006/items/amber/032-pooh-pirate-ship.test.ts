/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { poohPirateShip } from "@lorcanito/lorcana-engine/cards/006/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Pooh Pirate Ship", () => {
  it.skip("MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: poohPirateShip.cost,
      play: [poohPirateShip],
      hand: [poohPirateShip],
    });

    await testEngine.playCard(poohPirateShip);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
