import { describe, expect, it } from "bun:test";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { kakamoraPiratePitcher } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kakamora - Pirate Pitcher", () => {
  it("DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: kakamoraPiratePitcher.cost,
      hand: [kakamoraPiratePitcher],
      play: [mrSmeeBumblingMate],
    });
    const target = testEngine.getCardModel(mrSmeeBumblingMate);

    await testEngine.playCard(kakamoraPiratePitcher, {
      targets: [mrSmeeBumblingMate],
    });
    expect(target.hasEvasive);
  });

  it("Cannot target non-pirate character.)", async () => {
    const testEngine = new TestEngine({
      inkwell: kakamoraPiratePitcher.cost,
      hand: [kakamoraPiratePitcher],
      play: [tipoGrowingSon],
    });

    await testEngine.playCard(kakamoraPiratePitcher);
    const target = testEngine.getCardModel(tipoGrowingSon);

    await testEngine.resolveOptionalAbility();
    expect(testEngine.stackLayers).toHaveLength(0);
    expect(!target.hasEvasive);
  });
});
