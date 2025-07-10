/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { herculesBabyDemigod } from "@lorcanito/lorcana-engine/cards/006";
import { pennyTheOrphanCleverChild } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Penny The Orphan - Clever Child", () => {
  it("OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)", async () => {
    const testEngine = new TestEngine({
      inkwell: herculesBabyDemigod.cost,
      play: [pennyTheOrphanCleverChild],
      hand: [herculesBabyDemigod],
    });

    expect(testEngine.getCardModel(pennyTheOrphanCleverChild).hasWard).toBe(
      false,
    );
    await testEngine.playCard(herculesBabyDemigod);
    expect(testEngine.getCardModel(herculesBabyDemigod).zone).toBe("play");
    expect(testEngine.getCardModel(pennyTheOrphanCleverChild).hasWard).toBe(
      true,
    );
  });
});
