/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { skullRockIsolatedFortress } from "~/game-engine/engines/lorcana/src/cards/definitions/006/locations/locations";

describe("Skull Rock - Isolated Fortress", () => {
  it.skip("FAMILIAR GROUND Characters get +1 {S} while here.", async () => {
    const testEngine = new TestEngine({
      inkwell: skullRockIsolatedFortress.cost,
      play: [skullRockIsolatedFortress],
      hand: [skullRockIsolatedFortress],
    });

    await testEngine.playCard(skullRockIsolatedFortress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("SAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: skullRockIsolatedFortress.cost,
      play: [skullRockIsolatedFortress],
      hand: [skullRockIsolatedFortress],
    });

    await testEngine.playCard(skullRockIsolatedFortress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
