/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { aladdinHeroicOutlaw } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { fryingPan } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { hotPotato } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

describe("Hot Potato", () => {
  it("Deal 2 damage to chosen character", () => {
    const testStore = new TestStore({
      inkwell: hotPotato.cost,
      hand: [hotPotato],
      play: [aladdinHeroicOutlaw],
    });

    const cardUnderTest = testStore.getCard(hotPotato);
    const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);

    cardUnderTest.playFromHand();

    // Choose the damage option (mode 1)
    testStore.resolveTopOfStack({ mode: "1" }, true);

    // Resolve the damage effect
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toBe(2);
  });

  it("Banish chosen item", () => {
    const testStore = new TestStore({
      inkwell: hotPotato.cost,
      hand: [hotPotato],
      play: [fryingPan],
    });

    const cardUnderTest = testStore.getCard(hotPotato);
    const target = testStore.getByZoneAndId("play", fryingPan.id);

    cardUnderTest.playFromHand();

    // Choose the banish option (mode 2)
    testStore.resolveTopOfStack({ mode: "2" }, true);

    // Resolve the banish effect
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("discard");
  });
});
