/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  bePrepared,
  grabYourSword,
  hakunaMatata,
} from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import {
  owlIslandSecludedEntrance,
  peterPanShadowCatcher,
  stitchLittleTrickster,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Owl's Island - Isolated Entrance", () => {
  it("TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: hakunaMatata.cost + owlIslandSecludedEntrance.moveCost * 2,
      play: [
        owlIslandSecludedEntrance,
        peterPanShadowCatcher,
        stitchLittleTrickster,
      ],
      hand: [hakunaMatata, grabYourSword],
    });

    const actionCard = testEngine.getCardModel(hakunaMatata);
    const anotherActionCard = testEngine.getCardModel(grabYourSword);

    expect(actionCard.cost).toBe(hakunaMatata.cost);

    await testEngine.moveToLocation({
      location: owlIslandSecludedEntrance,
      character: peterPanShadowCatcher,
    });

    expect(actionCard.cost).toBe(hakunaMatata.cost - 1);

    await testEngine.moveToLocation({
      location: owlIslandSecludedEntrance,
      character: stitchLittleTrickster,
    });

    expect(actionCard.cost).toBe(hakunaMatata.cost - 2);
    expect(anotherActionCard.cost).toBe(grabYourSword.cost - 2);

    await testEngine.playCard(hakunaMatata);

    expect(anotherActionCard.cost).toBe(grabYourSword.cost);
  });

  it("LOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: hakunaMatata.cost + grabYourSword.cost + bePrepared.cost,
      play: [owlIslandSecludedEntrance],
      hand: [hakunaMatata, grabYourSword, bePrepared],
    });

    await testEngine.playCard(hakunaMatata);
    expect(testEngine.getLoreForPlayer("player_one")).toBe(0);
    await testEngine.playCard(grabYourSword);
    expect(testEngine.getLoreForPlayer("player_one")).toBe(3);
    await testEngine.playCard(bePrepared);
    expect(testEngine.getLoreForPlayer("player_one")).toBe(3);
  });
});
