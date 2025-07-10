import { describe, expect, it } from "@jest/globals";
/**
 * @jest-environment node
 */
import {
  heiheiBoatSnack,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

it("can put card in inkwell", () => {
  const testStore = new TestStore({
    hand: [heiheiBoatSnack],
  });
  const first = testStore.getByZoneAndId("hand", heiheiBoatSnack.id);

  first.addToInkwell();
  expect(first.zone).toEqual("inkwell");

  expect(testStore.getZonesCardCount()).toEqual(
    expect.objectContaining({ inkwell: 1 }),
  );
});

it("Cannot put two cards in the inkwell zone the same turn", () => {
  const testStore = new TestStore({
    hand: [heiheiBoatSnack, moanaOfMotunui],
  });
  const first = testStore.getByZoneAndId("hand", heiheiBoatSnack.id);
  const second = testStore.getByZoneAndId("hand", moanaOfMotunui.id);

  first.addToInkwell();
  expect(first.zone).toEqual("inkwell");
  second.addToInkwell();
  expect(second.zone).toEqual("hand");

  expect(testStore.getZonesCardCount()).toEqual(
    expect.objectContaining({ inkwell: 1 }),
  );
});
