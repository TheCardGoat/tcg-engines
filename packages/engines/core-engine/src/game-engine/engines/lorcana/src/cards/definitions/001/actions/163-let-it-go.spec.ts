/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Let it Go", () => {
  it("Adds your own char to inkwell", () => {
    const testStore = new TestStore({
      inkwell: letItGo.cost,
      hand: [letItGo],
      play: [moanaOfMotunui],
    });
    const store = testStore.store;
    const tableStore = store.tableStore;

    const cardUnderTest = testStore.getByZoneAndId("hand", letItGo.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      targets: [target],
    });

    expect(
      tableStore.getPlayerZone("player_one", "inkwell")?.cards,
    ).toHaveLength(letItGo.cost + 1);
    expect(target.zone).toEqual("inkwell");
    expect(target.ready).toBeFalsy();
  });

  it("Adds opponent's char to inkwell", () => {
    const testStore = new TestStore(
      {
        inkwell: letItGo.cost,
        hand: [letItGo],
      },
      {
        play: [moanaOfMotunui],
      },
    );
    const store = testStore.store;
    const tableStore = store.tableStore;

    const cardUnderTest = testStore.getByZoneAndId("hand", letItGo.id);
    const target = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(
      tableStore.getPlayerZone("player_two", "inkwell")?.cards,
    ).toHaveLength(1);
    expect(target.zone).toEqual("inkwell");
    expect(target.ready).toBeFalsy();
  });
});
