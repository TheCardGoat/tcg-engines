/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  chiefBogoCommandingOfficer,
  jimDearBelovedHusband,
  lafayetteSleepyDachshund,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
