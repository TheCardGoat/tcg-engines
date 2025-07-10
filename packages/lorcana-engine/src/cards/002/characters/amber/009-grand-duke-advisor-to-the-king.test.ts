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
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
