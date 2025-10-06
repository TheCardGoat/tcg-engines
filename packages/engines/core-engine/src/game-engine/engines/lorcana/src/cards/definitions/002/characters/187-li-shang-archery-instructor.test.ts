/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  goofyKnightForADay,
  liShangArcheryInstructor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Li Shang- Archery Instructor", () => {
  it("**ARCHERY LESSON** Whenever this character quests, your characters gain **Evasive** this turn. _(They can challenge characters with Evasive.)_", async () => {
    const testEngine = new TestEngine({
      play: [liShangArcheryInstructor, goofyKnightForADay],
    });

    const cardUnderTest = testEngine.getCardModel(liShangArcheryInstructor);
    const target = testEngine.getCardModel(goofyKnightForADay);

    expect(cardUnderTest.hasEvasive).toBe(false);
    expect(target.hasEvasive).toBe(false);

    await testEngine.questCard(liShangArcheryInstructor);

    expect(cardUnderTest.hasEvasive).toBe(true);
    expect(target.hasEvasive).toBe(true);
  });
});
