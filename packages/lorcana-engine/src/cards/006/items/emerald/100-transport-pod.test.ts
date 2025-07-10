/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { vanellopeVonSchweetzCandyMechanic } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import {
  sugarRushSpeedwayFinishLine,
  transportPod,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Transport Pod", () => {
  it("GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.", async () => {
    const testEngine = new TestEngine(
      {},
      {
        play: [
          transportPod,
          sugarRushSpeedwayFinishLine,
          vanellopeVonSchweetzCandyMechanic,
        ],
        deck: 3,
      },
    );

    await testEngine.passTurn();

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack(
      {
        targets: [vanellopeVonSchweetzCandyMechanic],
      },
      true,
    );
    await testEngine.resolveTopOfStack({
      targets: [sugarRushSpeedwayFinishLine],
    });

    const character = testEngine.getCardModel(
      vanellopeVonSchweetzCandyMechanic,
    );
    const location = testEngine.getCardModel(sugarRushSpeedwayFinishLine);

    expect(location.containsCharacter(character)).toBe(true);
    expect(character.isAtLocation(location)).toBe(true);
  });
});
