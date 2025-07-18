/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyKnightForADay,
  theQueenCommandingPresence,
  theQueenRegalMonarch,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Queen - Commanding Presence", () => {
  it("has shift", () => {
    const testStore = new TestStore({
      inkwell: theQueenCommandingPresence.cost,
      play: [theQueenCommandingPresence],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theQueenCommandingPresence.id,
    );

    expect(cardUnderTest.hasShift).toEqual(true);
  });

  it("**WHO IS THE FAIREST?** Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: theQueenCommandingPresence.cost,
        play: [theQueenCommandingPresence, theQueenRegalMonarch],
      },
      { play: [goofyKnightForADay] },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theQueenCommandingPresence.id,
    );
    const target = testStore.getByZoneAndId("play", theQueenRegalMonarch.id);
    const opponentTarget = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
      "player_two",
    );
    cardUnderTest.quest();

    testStore.resolveTopOfStack({ targets: [opponentTarget] }, true);
    expect(opponentTarget.strength).toEqual(goofyKnightForADay.strength - 4);

    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.strength).toEqual(theQueenRegalMonarch.strength + 4);
  });
});
