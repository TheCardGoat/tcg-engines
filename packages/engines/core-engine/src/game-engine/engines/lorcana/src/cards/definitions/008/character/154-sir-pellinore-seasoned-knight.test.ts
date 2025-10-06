/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  goGoTomagoMechanicalEngineer,
  patchPlayfulPup,
  sirPellinoreSeasonedKnight,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Sir Pellinore - Seasoned Knight", () => {
  it("CODE OF HONOR Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      inkwell: sirPellinoreSeasonedKnight.cost,
      play: [
        patchPlayfulPup,
        sirPellinoreSeasonedKnight,
        goGoTomagoMechanicalEngineer,
      ],
    });
    expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(false);
    expect(
      testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
    ).toBe(false);
    await testEngine.questCard(sirPellinoreSeasonedKnight);
    expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(true);
    expect(
      testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
    ).toBe(true);
    testEngine.passTurn();
    expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(false);
    expect(
      testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
    ).toBe(false);
  });
});
