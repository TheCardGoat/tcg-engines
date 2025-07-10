/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Cinderella - Ballroom Sensation", () => {
  it("Singer", () => {
    const testStore = new TestStore({
      play: [cinderellaBallroomSensation],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
    );

    expect(cardUnderTest.hasSinger).toEqual(true);
  });
});
