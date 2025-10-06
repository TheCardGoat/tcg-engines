/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  duchessElegantFeline,
  mufasaRespectedKing,
  outOfOrder,
  wreckitRalphHerosDuty,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wreck-it Ralph - Hero's Duty", () => {
  it("OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: outOfOrder.cost + dragonFire.cost,
      play: [wreckitRalphHerosDuty, duchessElegantFeline, mufasaRespectedKing],
      hand: [dragonFire, outOfOrder],
    });

    expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
      wreckitRalphHerosDuty.lore,
    );
    await testEngine.playCard(dragonFire, {
      targets: [duchessElegantFeline],
    });
    expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
      wreckitRalphHerosDuty.lore + 1,
    );
    await testEngine.playCard(outOfOrder, {
      targets: [mufasaRespectedKing],
    });
    expect(testEngine.getCardModel(wreckitRalphHerosDuty).lore).toBe(
      wreckitRalphHerosDuty.lore + 2,
    );
  });
});
