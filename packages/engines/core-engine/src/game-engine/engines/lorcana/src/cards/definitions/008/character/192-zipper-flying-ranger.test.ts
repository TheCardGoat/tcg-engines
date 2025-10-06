/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  montereyJackDefiantProtector,
  zipperFlyingRanger,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Zipper - Flying Ranger", () => {
  it("BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.", async () => {
    const testEngine = new TestEngine({
      inkwell: zipperFlyingRanger.cost - 1,
      play: [montereyJackDefiantProtector],
      hand: [zipperFlyingRanger],
    });

    await testEngine.playCard(zipperFlyingRanger);

    expect(testEngine.getCardModel(zipperFlyingRanger).zone).toBe("play");
  });

  it("BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine({
      inkwell: zipperFlyingRanger.cost,
      play: [zipperFlyingRanger],
      hand: [],
    });

    expect(testEngine.getCardModel(zipperFlyingRanger).hasEvasive).toBe(true);
    await testEngine.passTurn();
    expect(testEngine.getCardModel(zipperFlyingRanger).hasEvasive).toBe(false);
  });
});
