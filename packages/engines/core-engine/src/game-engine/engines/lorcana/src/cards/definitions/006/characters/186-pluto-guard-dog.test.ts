/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { plutoGuardDog } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
