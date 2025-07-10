/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  jasperCommonCrook,
  liloMakingAWish,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jasper - Common Crook", () => {
  it("**PUPPYNAPPING** Whenever this character quests, chosen opposing character can't quest during their next turn.", () => {
    const testStore = new TestStore(
      {
        deck: 2,
        inkwell: jasperCommonCrook.cost,
        play: [jasperCommonCrook],
      },
      {
        deck: 2,
        play: [liloMakingAWish],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      jasperCommonCrook.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      liloMakingAWish.id,
      "player_two",
    );

    cardUnderTest.quest();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    testStore.store.passTurn("player_one");

    expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(0);
    target.quest();
    expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(0);
  });
});
