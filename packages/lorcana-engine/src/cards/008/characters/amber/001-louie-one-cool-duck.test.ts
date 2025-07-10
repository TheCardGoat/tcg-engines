/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kingCandySugarRushNightmare,
  louieOneCoolDuck,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Louie - One Cool Duck", () => {
  it("SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.", async () => {
    const testEngine = new TestEngine(
      {
        play: [kingCandySugarRushNightmare],
      },
      {
        play: [louieOneCoolDuck],
      },
    );

    await testEngine.challenge({
      attacker: kingCandySugarRushNightmare,
      defender: louieOneCoolDuck,
      exertDefender: true,
    });

    expect(testEngine.getCardModel(louieOneCoolDuck).damage).toBe(
      kingCandySugarRushNightmare.strength - 1,
    );
  });
});
