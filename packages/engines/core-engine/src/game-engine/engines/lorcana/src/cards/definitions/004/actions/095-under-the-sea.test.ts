import { describe, expect, it } from "bun:test";
import {
  heiheiBoatSnack,
  minnieMouseBelovedPrincess,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { underTheSea } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  agustinMadrigalClumsyDad,
  arielSingingMermaid,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
