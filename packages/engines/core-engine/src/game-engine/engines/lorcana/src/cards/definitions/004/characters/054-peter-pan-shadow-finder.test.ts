/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  peterPanShadowFinder,
  ticktockEverpresentPursuer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Peter Pan - Shadow Finder", () => {
  it("**Rush** _(This character can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      play: [peterPanShadowFinder],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      peterPanShadowFinder.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [peterPanShadowFinder],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      peterPanShadowFinder.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("**FLY, OF COURSE!** Your other characters with **Evasive** gain **Rush.**", () => {
    const testStore = new TestStore({
      inkwell: peterPanShadowFinder.cost,
      hand: [peterPanShadowFinder],
      play: [ticktockEverpresentPursuer],
    });

    const cardUnderTest = testStore.getCard(peterPanShadowFinder);
    const target = testStore.getCard(ticktockEverpresentPursuer);

    expect(target.hasEvasive).toBe(true);
    expect(target.hasRush).toBe(false);

    cardUnderTest.playFromHand();

    expect(target.hasEvasive).toBe(true);
    expect(target.hasRush).toBe(true);

    console.log("Banishing Peter Pan");
    cardUnderTest.banish();

    expect(target.hasEvasive).toBe(true);
    expect(target.hasRush).toBe(false);
  });
});
