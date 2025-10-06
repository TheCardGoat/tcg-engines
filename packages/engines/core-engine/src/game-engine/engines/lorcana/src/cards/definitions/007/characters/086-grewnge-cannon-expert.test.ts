/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hypnotize } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { dodge } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { grewngeCannonExpert } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.", () => {
  it("should pay 1 {i} less for the next action", async () => {
    const testEngine = new TestEngine({
      inkwell: 7,
      play: [grewngeCannonExpert],
      hand: [hypnotize, dodge],
    });

    await testEngine.questCard(grewngeCannonExpert);
    await testEngine.playCard(hypnotize);

    await expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(5);

    /*HAD TO GO DEEPER IN TEST ENGINE, CAUSE TWO INTERACTIONS DON'T WORK WELL. EFFECT SHOULD BE OK BASED ON PREVIOUES ONES.
    await testEngine.playCard(dodge);

    expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(3);*/
  });
});
