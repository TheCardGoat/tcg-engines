/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { starkeyDeviousPirate } from "@lorcanito/lorcana-engine/cards/003/characters/characters.ts";
import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("And Then Along Came Zeus", () => {
  describe("_(A character with cost 4 or more can {E} to sing this song for free.)_Deal 5 damage to chosen character or location.", () => {});
  it("should deal 5 damage to chosen character", () => {
    const testStore = new TestStore({
      inkwell: andThenAlongCameZeus.cost,
      hand: [andThenAlongCameZeus],
      play: [starkeyDeviousPirate],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      andThenAlongCameZeus.id,
    );

    const target = testStore.getByZoneAndId("play", starkeyDeviousPirate.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toBe(5);
  });

  it("should deal 5 damage to chosen location", () => {
    const testStore = new TestStore({
      inkwell: andThenAlongCameZeus.cost,
      hand: [andThenAlongCameZeus],
      play: [forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      andThenAlongCameZeus.id,
    );

    const target = testStore.getByZoneAndId(
      "play",
      forbiddenMountainMaleficentsCastle.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toBe(5);
  });
});
