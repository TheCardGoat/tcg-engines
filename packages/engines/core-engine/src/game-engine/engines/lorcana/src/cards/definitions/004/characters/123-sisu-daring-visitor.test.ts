/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rafikiMysticalFighter } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { sisuDaringVisitor } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sisu - Daring Visitor", () => {
  it("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [sisuDaringVisitor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      sisuDaringVisitor.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("**BRING ON THE HEAT!** When you play this character, banish chosen opposing character with 1 {S} or less.", () => {
    const testStore = new TestStore(
      {
        inkwell: sisuDaringVisitor.cost,
        hand: [sisuDaringVisitor],
      },
      {
        play: [rafikiMysticalFighter],
      },
    );

    const cardUnderTest = testStore.getCard(sisuDaringVisitor);
    const target = testStore.getCard(rafikiMysticalFighter);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("discard");
  });
});
