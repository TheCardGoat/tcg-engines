/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rafikiMysticalFighter } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rafiki - Mystical Fighter", () => {
  it.skip("**Challenger** +3 _(While challenging, this character gets +3 {S}.)_", async () => {
    const testEngine = new TestEngine({
      play: [rafikiMysticalFighter],
    });

    const cardUnderTest = testEngine.getCardModel(rafikiMysticalFighter);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  it.skip("**ANCIENT SKILLS** Whenever he challenges a Hyena character, this character takes no damage from the challenge.", async () => {
    const testEngine = new TestEngine({
      inkwell: rafikiMysticalFighter.cost,
      play: [rafikiMysticalFighter],
      hand: [rafikiMysticalFighter],
    });

    await testEngine.playCard(rafikiMysticalFighter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
