/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  magicBroomAerialCleaner,
  magicBroomBrigadeCommander,
  magicBroomIlluminaryKeeper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Magic Broom - Brigade Commander", () => {
  it("**Resist** +1 _(Damage dealt to this character is reduced by 1.)_", () => {
    const testEngine = new TestEngine({
      play: [magicBroomBrigadeCommander],
    });

    const cardUnderTest = testEngine.getCardModel(magicBroomBrigadeCommander);

    expect(cardUnderTest.hasAbility("resist")).toBe(true);
  });
  it("**ARMY OF BROOMS** This character gets +2 {S} for each other Broom character you have in play.", async () => {
    const testEngine = new TestEngine({
      play: [
        magicBroomBrigadeCommander,
        magicBroomIlluminaryKeeper,
        magicBroomAerialCleaner,
      ],
    });

    const cardUnderTest = testEngine.getCardModel(magicBroomBrigadeCommander);
    const target = testEngine.getCardModel(magicBroomAerialCleaner);

    expect(cardUnderTest.strength).toBe(6);

    await target.banish();

    expect(cardUnderTest.strength).toBe(4);
  });
});
