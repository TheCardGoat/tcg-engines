/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { audreyRamirezTheEngineer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Audrey Ramirez - The Engineer", () => {
  it("**SPARE PARTS** Whenever this character quests, ready one of your items.", async () => {
    const testEngine = new TestEngine({
      play: [audreyRamirezTheEngineer, pawpsicle],
    });

    const pawpsicleCard = testEngine.getCardModel(pawpsicle);
    pawpsicleCard.updateCardMeta({ exerted: true });

    await testEngine.questCard(audreyRamirezTheEngineer);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [pawpsicle] });

    expect(pawpsicleCard.exerted).toBe(false);
  });
});
