import { describe, expect, it } from "bun:test";
import { aPiratesLife } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { hiddenInkcaster } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items";
import { gatheringKnowledgeAndWisdom } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { petePirateScoundrel } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("PILFER AND PLUNDER Whenever you play an action that isn’t a song, you may banish chosen item.", () => {
  it("should banish chosen item when playing an action not a song", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [petePirateScoundrel, hiddenInkcaster],
      hand: [gatheringKnowledgeAndWisdom],
    });

    await testEngine.playCard(gatheringKnowledgeAndWisdom);

    const cardTarget = testEngine.getCardModel(hiddenInkcaster);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [cardTarget] });

    expect(cardTarget.zone).toEqual("discard");
  });
  it("should not banish chosen item when playing a song", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [petePirateScoundrel, hiddenInkcaster],
      hand: [aPiratesLife],
    });

    await testEngine.playCard(aPiratesLife);

    const cardTarget = testEngine.getCardModel(hiddenInkcaster);

    expect(cardTarget.zone).toEqual("play");
  });
});
