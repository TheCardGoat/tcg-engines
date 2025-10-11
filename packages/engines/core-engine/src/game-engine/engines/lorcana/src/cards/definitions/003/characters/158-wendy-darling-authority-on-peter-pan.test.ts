import { describe, expect, it } from "bun:test";
import { wendyDarlingAuthorityOnPeterPan } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wendy Darling - Authority on Peter Pan", () => {
  it("**Ward** _(Opponents can't choose this character except to challenge.)", () => {
    const testStore = new TestStore({
      inkwell: wendyDarlingAuthorityOnPeterPan.cost,
      play: [wendyDarlingAuthorityOnPeterPan],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      wendyDarlingAuthorityOnPeterPan.id,
    );

    expect(cardUnderTest.hasWard).toBe(true);
  });

  it("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      inkwell: wendyDarlingAuthorityOnPeterPan.cost,
      play: [wendyDarlingAuthorityOnPeterPan],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      wendyDarlingAuthorityOnPeterPan.id,
    );

    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
