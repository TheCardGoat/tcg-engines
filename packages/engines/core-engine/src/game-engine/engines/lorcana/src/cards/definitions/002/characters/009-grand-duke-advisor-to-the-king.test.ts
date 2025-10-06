/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  grandDukeAdvisorToTheKing,
  kuzcoWantedLlama,
  princeCharmingHeirToTheThrone,
  theQueenRegalMonarch,
  tianaDiligentWaitress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Grand Duke - Advisor to the King", () => {
  it("**YES, YOUR MAJESTY** Your Prince, Princess, King and Queen characters gain +1 {S}.", () => {
    const testStore = new TestStore({
      play: [
        grandDukeAdvisorToTheKing,
        theQueenRegalMonarch,
        kuzcoWantedLlama,
        princeCharmingHeirToTheThrone,
        tianaDiligentWaitress,
      ],
    });

    const royals = [
      theQueenRegalMonarch,
      kuzcoWantedLlama,
      princeCharmingHeirToTheThrone,
      tianaDiligentWaitress,
    ].map((card) => testStore.getByZoneAndId("play", card.id));

    royals.forEach((royal) => {
      expect(royal.strength).toBe((royal.lorcanitoCard.strength || 0) + 1);
    });
  });
});
