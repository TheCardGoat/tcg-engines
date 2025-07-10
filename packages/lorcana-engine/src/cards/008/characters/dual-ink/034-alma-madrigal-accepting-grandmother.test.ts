/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  aPiratesLife,
  secondStarToTheRight,
} from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import {
  almaMadrigalAcceptingGrandmother,
  friendOwlCantankerousNeighbor,
  mulanChargingAhead,
  thumperYoungBunny,
  vanellopeVonSchweetzSpunkySpeedster,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Alma Madrigal - Accepting Grandmother", () => {
  it("THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.", async () => {
    const singers = [
      vanellopeVonSchweetzSpunkySpeedster,
      thumperYoungBunny,
      mulanChargingAhead,
      friendOwlCantankerousNeighbor,
    ];

    const testEngine = new TestEngine({
      inkwell: almaMadrigalAcceptingGrandmother.cost,
      play: [almaMadrigalAcceptingGrandmother, ...singers],
      hand: [secondStarToTheRight, aPiratesLife],
    });

    await testEngine.singSongTogether({
      song: secondStarToTheRight,
      singers,
    });

    await testEngine.resolveTopOfStack({ targetPlayer: "player_two" }, true);
    await testEngine.acceptOptionalLayer();

    expect(testEngine.stackLayers).toHaveLength(0);
    for (const singer of singers) {
      expect(testEngine.getCardModel(singer).ready).toBe(true);
    }

    // Only triggers once
    await testEngine.singSongTogether({
      song: aPiratesLife,
      singers,
    });

    expect(testEngine.stackLayers).toHaveLength(0);
    for (const singer of singers) {
      expect(testEngine.getCardModel(singer).ready).toBe(false);
    }
  });
});
