/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  donKarnageAirPirateLeader,
  madDogKarnagesFirstMate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Mad Dog - Karnage's First Mate", () => {
  it("ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.", async () => {
    const testEngine = new TestEngine({
      inkwell: madDogKarnagesFirstMate.cost - 1,
      play: [donKarnageAirPirateLeader],
      hand: [madDogKarnagesFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(madDogKarnagesFirstMate);
    await testEngine.playCard(cardUnderTest);

    expect(cardUnderTest.zone).toEqual("play");

    // await testEngine.resolveOptionalAbility();
    // await testEngine.resolveTopOfStack({});
  });
});
