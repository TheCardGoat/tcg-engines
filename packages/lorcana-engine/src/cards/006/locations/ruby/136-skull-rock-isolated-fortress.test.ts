/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { skullRockIsolatedFortress } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
