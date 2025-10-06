/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { audreyRamirezTheEngineer } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
