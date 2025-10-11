import { describe, expect, it } from "bun:test";
import {
  cogsworthTalkingClock,
  feliciaAlwaysHungry,
  tukTukWreckingBall,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cogsworth - Talking Clock", () => {
  it("**WAIT A MINUTE** Your character with **Reckless** gain {E} − Gain 1 lore.", () => {
    const testStore = new TestStore({
      play: [cogsworthTalkingClock, feliciaAlwaysHungry, tukTukWreckingBall],
    });

    const target = testStore.getByZoneAndId("play", feliciaAlwaysHungry.id);
    const target2 = testStore.getByZoneAndId("play", tukTukWreckingBall.id);

    expect(testStore.getPlayerLore()).toEqual(0);

    expect(target.ready).toEqual(true);
    expect(target.hasActivatedAbility).toEqual(true);

    target.activate();

    expect(target.ready).toEqual(false);
    expect(testStore.getPlayerLore()).toEqual(1);

    expect(target2.ready).toEqual(true);
    expect(target2.hasActivatedAbility).toEqual(true);

    target2.activate();

    expect(target2.ready).toEqual(false);
    expect(testStore.getPlayerLore()).toEqual(2);
  });
});
