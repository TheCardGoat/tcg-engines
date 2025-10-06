/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { herculesBabyDemigod } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { pennyTheOrphanCleverChild } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
