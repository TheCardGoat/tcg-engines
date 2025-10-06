/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  agustinMadrigalClumsyDad,
  antonioMadrigalAnimalExpert,
  daisyDuckLovelyLady,
  sisuEmpoweredSibling,
  tongSurvivor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import { iceBlock } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sisu - Empowered Sibling", () => {
  it("**LET ME HANDLE THIS!** When you play this character, banish all opposing characters with 2 {S} or less.", () => {
    const testStore = new TestStore(
      {
        inkwell: sisuEmpoweredSibling.cost,
        hand: [sisuEmpoweredSibling],
        play: [
          agustinMadrigalClumsyDad,
          daisyDuckLovelyLady,
          antonioMadrigalAnimalExpert,
        ],
      },
      {
        play: [
          agustinMadrigalClumsyDad,
          daisyDuckLovelyLady,
          antonioMadrigalAnimalExpert,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      sisuEmpoweredSibling.id,
    );
    cardUnderTest.playFromHand();

    expect(
      testStore.getByZoneAndId("play", agustinMadrigalClumsyDad.id).zone,
    ).toBeTruthy();
    expect(
      testStore.getByZoneAndId("play", daisyDuckLovelyLady.id).zone,
    ).toBeTruthy();
    expect(
      testStore.getByZoneAndId("play", antonioMadrigalAnimalExpert.id),
    ).toBeTruthy();

    expect(
      testStore.getByZoneAndId(
        "discard",
        agustinMadrigalClumsyDad.id,
        "player_two",
      ).zone,
    ).toEqual("discard");
    expect(
      testStore.getByZoneAndId("discard", daisyDuckLovelyLady.id, "player_two")
        .zone,
    ).toEqual("discard");
    expect(
      testStore.getByZoneAndId(
        "play",
        antonioMadrigalAnimalExpert.id,
        "player_two",
      ),
    ).toBeTruthy();
  });
});

describe("Regression", () => {
  it("Should combo correctly with Ice block", () => {
    const testStore = new TestStore(
      {
        inkwell: sisuEmpoweredSibling.cost,
        hand: [sisuEmpoweredSibling],
        play: [iceBlock],
      },
      {
        play: [tongSurvivor],
      },
    );

    const cardUnderTest = testStore.getCard(sisuEmpoweredSibling);
    const debuff = testStore.getCard(iceBlock);
    const target = testStore.getCard(tongSurvivor);

    debuff.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toBe(tongSurvivor.strength - 1);

    cardUnderTest.playFromHand();

    expect(target.zone).toBe("discard");
  });
});
