/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { daleFriendInNeed } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import { rescueRangersSubmarineMobileHeadquarters } from "~/game-engine/engines/lorcana/src/cards/definitions/006/locations/locations";

describe("Rescue Rangers Submarine - Mobile Headquarters", () => {
  it("PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: rescueRangersSubmarineMobileHeadquarters.moveCost,
        deck: 5,
        play: [rescueRangersSubmarineMobileHeadquarters, daleFriendInNeed],
      },
      {
        deck: 2,
      },
    );

    await testEngine.moveToLocation({
      location: rescueRangersSubmarineMobileHeadquarters,
      character: daleFriendInNeed,
    });

    await testEngine.passTurn();
    await testEngine.passTurn();

    await testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        inkwell: rescueRangersSubmarineMobileHeadquarters.moveCost + 1,
        hand: 1,
        deck: 3,
      }),
    );
  });
});
