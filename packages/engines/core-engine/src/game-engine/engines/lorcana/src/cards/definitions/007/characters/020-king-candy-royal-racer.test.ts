/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  beastFrustratedDesigner,
  calhounCourageousRescuer,
  kingCandyRoyalRacer,
  liShangNewlyPromoted,
  outOfOrder,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("King Candy - Royal Racer", () => {
  it("SWEET REVENGE Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: outOfOrder.cost,
        play: [kingCandyRoyalRacer, calhounCourageousRescuer],
        hand: [outOfOrder],
      },
      {
        play: [liShangNewlyPromoted, beastFrustratedDesigner],
      },
    );

    await testEngine.playCard(
      outOfOrder,
      {
        targets: [calhounCourageousRescuer],
      },
      true,
    );

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveTopOfStack({ targets: [liShangNewlyPromoted] });

    expect(testEngine.getCardModel(liShangNewlyPromoted).zone).toBe("discard");
  });
});
