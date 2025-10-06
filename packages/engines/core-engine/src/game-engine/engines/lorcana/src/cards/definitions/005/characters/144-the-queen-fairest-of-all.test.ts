/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  theQueenCrownOfTheCouncil,
  theQueenCruelestOfAll,
  theQueenFairestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Queen - Fairest of All", () => {
  it("**REFLECTIONS OF VANITY** For each other character named The Queen you have in play, this character gets +1 {L}.", () => {
    const testStore = new TestStore({
      inkwell: theQueenFairestOfAll.cost,
      play: [
        theQueenFairestOfAll,
        theQueenCrownOfTheCouncil,
        theQueenCruelestOfAll,
      ],
    });

    expect(testStore.getCard(theQueenFairestOfAll).lore).toEqual(
      theQueenFairestOfAll.lore + 2,
    );
  });
});
