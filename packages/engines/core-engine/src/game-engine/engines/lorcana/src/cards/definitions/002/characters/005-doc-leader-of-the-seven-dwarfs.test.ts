/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  docLeaderOfTheSevenDwarfs,
  eudoraAccomplishedSeamstress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Doc - Leader of the Seven Dwarfs", () => {
  it("**SHARE AND SHARE ALIKE** Whenever this character quests, you pay 1 {I} less for the next character you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: eudoraAccomplishedSeamstress.cost - 1,
      hand: [eudoraAccomplishedSeamstress],
      play: [docLeaderOfTheSevenDwarfs],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      docLeaderOfTheSevenDwarfs.id,
    );
    const reducedCostChar = testStore.getByZoneAndId(
      "hand",
      eudoraAccomplishedSeamstress.id,
    );

    cardUnderTest.quest();
    reducedCostChar.playFromHand();

    expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
    expect(reducedCostChar.zone).toEqual("play");
  });
});
