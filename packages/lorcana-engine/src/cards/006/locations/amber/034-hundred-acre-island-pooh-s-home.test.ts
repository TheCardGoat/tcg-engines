/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hundredAcreIslandPoohsHome } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Hundred Acre Island - Pooh's Home", () => {
  it.skip("FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: hundredAcreIslandPoohsHome.cost,
      play: [hundredAcreIslandPoohsHome],
      hand: [hundredAcreIslandPoohsHome],
    });

    await testEngine.playCard(hundredAcreIslandPoohsHome);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
