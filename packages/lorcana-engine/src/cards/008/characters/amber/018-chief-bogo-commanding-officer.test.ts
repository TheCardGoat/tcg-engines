/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  chiefBogoCommandingOfficer,
  jimDearBelovedHusband,
  lafayetteSleepyDachshund,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Chief Bogo - Commanding Officer", () => {
  it("SENDING BACKUP During an opponent’s turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it’s a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: dragonFire.cost,
        hand: [dragonFire],
      },
      {
        deck: [lafayetteSleepyDachshund],
        play: [chiefBogoCommandingOfficer, jimDearBelovedHusband],
      },
    );

    await testEngine.playCard(
      dragonFire,
      { targets: [jimDearBelovedHusband] },
      true,
    );
    expect(testEngine.getCardModel(jimDearBelovedHusband).zone).toBe("discard");

    testEngine.changeActivePlayer("player_two");
    await testEngine.acceptOptionalLayer();
    await testEngine.acceptOptionalLayer();

    expect(testEngine.getCardModel(lafayetteSleepyDachshund).zone).toBe("play");
  });
});
