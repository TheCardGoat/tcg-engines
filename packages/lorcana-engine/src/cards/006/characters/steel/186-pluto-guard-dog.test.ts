/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { plutoGuardDog } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Pluto - Guard Dog", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [plutoGuardDog],
    });

    const cardUnderTest = testEngine.getCardModel(plutoGuardDog);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it.skip("BRAVO While this character has no damage, he gets +4 {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: plutoGuardDog.cost,
      play: [plutoGuardDog],
      hand: [plutoGuardDog],
    });

    await testEngine.playCard(plutoGuardDog);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
