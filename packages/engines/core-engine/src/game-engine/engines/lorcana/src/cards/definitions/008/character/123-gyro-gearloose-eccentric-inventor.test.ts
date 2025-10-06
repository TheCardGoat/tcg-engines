/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  gyroGearlooseEccentricInventor,
  montereyJackDefiantProtector,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gyro Gearloose - Eccentric Inventor", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [gyroGearlooseEccentricInventor],
    });

    const cardUnderTest = testEngine.getCardModel(
      gyroGearlooseEccentricInventor,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("I'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: gyroGearlooseEccentricInventor.cost,
        hand: [gyroGearlooseEccentricInventor],
      },
      {
        play: [montereyJackDefiantProtector],
      },
    );
    expect(testEngine.getCardModel(montereyJackDefiantProtector).strength).toBe(
      4,
    );
    await testEngine.playCard(gyroGearlooseEccentricInventor);
    await testEngine.resolveTopOfStack({
      targets: [montereyJackDefiantProtector],
    });
    expect(testEngine.getCardModel(montereyJackDefiantProtector).strength).toBe(
      1,
    );
    testEngine.passTurn();
    expect(testEngine.getCardModel(montereyJackDefiantProtector).strength).toBe(
      4,
    );
  });
});
