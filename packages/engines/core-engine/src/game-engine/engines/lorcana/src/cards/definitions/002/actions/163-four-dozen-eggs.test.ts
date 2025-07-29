import { describe, expect, it } from "bun:test";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { fourDozenEggs } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { owlLogicalLecturer } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Four Dozen Eggs", () => {
  it("Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", () => {
    const testStore = new TestStore({
      inkwell: fourDozenEggs.cost,
      hand: [fourDozenEggs],
      play: [liloMakingAWish, owlLogicalLecturer],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", fourDozenEggs.id);
    const target = testStore.getByZoneAndId("play", owlLogicalLecturer.id);
    const anotherTarget = testStore.getByZoneAndId("play", liloMakingAWish.id);

    [target, anotherTarget].forEach((character) => {
      expect(character.hasResist).toBe(false);
    });

    cardUnderTest.playFromHand();

    [target, anotherTarget].forEach((character) => {
      expect(character.hasResist).toBe(true);
    });
    expect(cardUnderTest.zone).toEqual("discard");
  });
});
