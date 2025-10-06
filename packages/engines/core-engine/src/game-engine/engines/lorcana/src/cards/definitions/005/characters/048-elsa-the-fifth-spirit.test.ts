/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  elsaTheFifthSpirit,
  monstroWhaleOfAWhale,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Elsa The Fifth Spirit", () => {
  it("**CRYSTALLIZE** When you play this character, exert chosen opposing character.", () => {
    const testStore = new TestStore(
      {
        inkwell: elsaTheFifthSpirit.cost,
        hand: [elsaTheFifthSpirit],
      },
      {
        play: [monstroWhaleOfAWhale],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      elsaTheFifthSpirit.id,
    );
    const target = testStore.getCard(monstroWhaleOfAWhale);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.meta.exerted).toBe(true);
  });
});

// describe("Regression", () => {
//   it("Should not lock people when Elsa The Fifth Spirit is played without a valid target", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: elsaTheFifthSpirit.cost,
//         hand: [elsaTheFifthSpirit],
//       },
//       {
//         play: [princeJohnGreediestOfAll, diabloDevotedHerald],
//       },
//     );
//
//     await testEngine.tapCard(diabloDevotedHerald);
//     await testEngine.playCard(elsaTheFifthSpirit);
//
//     await testEngine.resolveTopOfStack({ targets: [diabloDevotedHerald] });
//   });
// });
