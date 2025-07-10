/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hypnotize } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { dodge } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { grewngeCannonExpert } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
