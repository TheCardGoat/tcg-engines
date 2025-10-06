/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  jasperCommonCrook,
  liloMakingAWish,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

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
