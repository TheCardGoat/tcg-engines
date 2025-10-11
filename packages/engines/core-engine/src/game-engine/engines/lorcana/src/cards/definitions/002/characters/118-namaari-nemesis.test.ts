import { describe, expect, it } from "bun:test";
import {
  goofyKnightForADay,
  namaariNemesis,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Namaari - Nemesis", () => {
  it("**THIS SHOULDN'T TAKE LONG** {E}, Banish this character − Banish chosen character.", () => {
    const testStore = new TestStore(
      {
        play: [namaariNemesis],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("play", namaariNemesis.id);
    const target = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
      "player_two",
    );

    cardUnderTest.activate();

    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.zone).toBe("discard");
    expect(cardUnderTest.zone).toBe("discard");
  });
});
