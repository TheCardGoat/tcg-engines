/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  bambiPrinceOfTheForest,
  jeweledCollar,
  jumbaJookibaCriticalScientist,
  khanWarHorse,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Jeweled Collar", () => {
  it("WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine(
      {
        play: [bambiPrinceOfTheForest],
      },
      {
        play: [jeweledCollar, khanWarHorse],
        deck: [jumbaJookibaCriticalScientist],
      },
    );

    await testEngine.challenge({
      attacker: bambiPrinceOfTheForest,
      defender: khanWarHorse,
      exertDefender: true,
    });

    expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(0);

    testEngine.changeActivePlayer("player_two");
    await testEngine.acceptOptionalLayer();

    expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(1);
  });
});
