/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  madamMimPurpleDragon,
  theQueenRegalMonarch,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { fangCrossbow } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";

describe("Fang Crossbow", () => {
  it("**CAREFUL AIM** {E}, 2 {I} – Chosen character gets -2 {S} this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: 2,
        play: [fangCrossbow, theQueenRegalMonarch],
      },
      { deck: 1 },
    );

    const cardUnderTest = testStore.getByZoneAndId("play", fangCrossbow.id);
    const target = testStore.getByZoneAndId("play", theQueenRegalMonarch.id);

    expect(target.strength).toEqual(theQueenRegalMonarch.strength);

    cardUnderTest.activate("Careful Aim");
    testStore.resolveTopOfStack({ targets: [target] });

    expect(cardUnderTest.ready).toEqual(false);
    expect(target.strength).toEqual(theQueenRegalMonarch.strength - 2);

    testStore.passTurn();

    expect(target.strength).toEqual(theQueenRegalMonarch.strength);
  });

  describe("**STAY BACK!** {E}, Banish this item – Banish chosen Dragon character.", () => {
    it("should banish a dragon", () => {
      const testStore = new TestStore({
        inkwell: fangCrossbow.cost,
        play: [fangCrossbow, madamMimPurpleDragon],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", fangCrossbow.id);
      const target = testStore.getByZoneAndId("play", madamMimPurpleDragon.id);

      cardUnderTest.activate("Stay Back!");
      testStore.resolveTopOfStack({ targets: [target] });

      expect(cardUnderTest.zone).toEqual("discard");
      expect(target.zone).toEqual("discard");
    });

    it("should NOT banish a NON-dragon", () => {
      const testStore = new TestStore({
        inkwell: fangCrossbow.cost,
        play: [fangCrossbow, theQueenRegalMonarch],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", fangCrossbow.id);
      const target = testStore.getByZoneAndId("play", theQueenRegalMonarch.id);

      cardUnderTest.activate("Stay Back!");
      testStore.resolveTopOfStack({ targets: [target] }, true);

      expect(cardUnderTest.zone).toEqual("discard");
      expect(target.zone).toEqual("play");
      expect(testStore.stackLayers).toHaveLength(0);

      testStore.resolveTopOfStack({ skip: true });
    });
  });
});
