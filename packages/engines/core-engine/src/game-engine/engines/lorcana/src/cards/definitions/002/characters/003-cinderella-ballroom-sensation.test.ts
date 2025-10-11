import { describe, expect, it } from "bun:test";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cinderella - Ballroom Sensation", () => {
  it("Singer", () => {
    const testStore = new TestStore({
      play: [cinderellaBallroomSensation],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
    );

    expect(cardUnderTest.hasSinger()).toEqual(true);
  });
});
