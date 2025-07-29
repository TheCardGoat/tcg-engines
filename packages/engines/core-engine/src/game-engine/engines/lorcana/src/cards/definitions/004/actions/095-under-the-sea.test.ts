/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  heiheiBoatSnack,
  minnieMouseBelovedPrincess,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { underTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import {
  agustinMadrigalClumsyDad,
  arielSingingMermaid,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Under The Sea", () => {
  it("Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.", () => {
    const testStore = new TestStore(
      {
        inkwell: underTheSea.cost,
        hand: [underTheSea],
      },
      {
        play: [
          minnieMouseBelovedPrincess,
          heiheiBoatSnack,
          agustinMadrigalClumsyDad,
          arielSingingMermaid,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", underTheSea.id);

    cardUnderTest.playFromHand();

    expect(testStore.getCard(heiheiBoatSnack).zone).toEqual("deck");
    expect(testStore.getCard(agustinMadrigalClumsyDad).zone).toEqual("deck");
    expect(testStore.getCard(minnieMouseBelovedPrincess).zone).toEqual("deck");

    expect(testStore.getCard(arielSingingMermaid).zone).toEqual("play");
  });
});
