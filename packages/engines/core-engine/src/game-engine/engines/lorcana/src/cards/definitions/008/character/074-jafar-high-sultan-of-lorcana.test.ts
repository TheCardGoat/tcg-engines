/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  jafarHighSultanOfLorcana,
  palaceGuardSpectralSentry,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jafar - High Sultan of Lorcana", () => {
  it("DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.", async () => {
    const testEngine = new TestEngine({
      play: [jafarHighSultanOfLorcana],
      hand: [palaceGuardSpectralSentry],
    });

    await testEngine.questCard(jafarHighSultanOfLorcana);
    await testEngine.acceptOptionalLayer();

    expect(testEngine.getZonesCardCount().hand).toEqual(2);
    await testEngine.resolveTopOfStack({
      targets: [palaceGuardSpectralSentry],
    });

    expect(testEngine.getCardModel(palaceGuardSpectralSentry).zone).toEqual(
      "play",
    );
  });
});
