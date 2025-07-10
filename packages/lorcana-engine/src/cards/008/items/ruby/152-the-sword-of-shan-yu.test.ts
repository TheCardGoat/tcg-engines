/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mulanArmoredFighter } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  khanWarHorse,
  perditaOnTheLookout,
  theSwordOfShanYu,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Sword Of Shan Yu", () => {
  it("WORTHY WEAPON {E}, {E} one of your characters - Ready chosen character. They can't quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      play: [theSwordOfShanYu, perditaOnTheLookout, khanWarHorse],
    });

    await testEngine.tapCard(perditaOnTheLookout);

    await testEngine.activateCard(theSwordOfShanYu, {
      costs: [khanWarHorse],
    });

    expect(testEngine.getCardModel(perditaOnTheLookout).exerted).toBe(true);
    expect(testEngine.getCardModel(khanWarHorse).exerted).toBe(true);

    await testEngine.resolveTopOfStack({ targets: [perditaOnTheLookout] });

    expect(testEngine.getCardModel(perditaOnTheLookout).exerted).toBe(false);
    expect(testEngine.getCardModel(perditaOnTheLookout).canQuest).toBe(false);
  });

  it("WORTHY WEAPON {E}, {E} one of your characters - Ready chosen character. They can't quest for the rest of this turn. (no drying characters)", async () => {
    const testEngine = new TestEngine({
      play: [theSwordOfShanYu, khanWarHorse],
      hand: [mulanArmoredFighter],
      inkwell: mulanArmoredFighter.cost,
    });

    await testEngine.playCard(mulanArmoredFighter);
    await testEngine.activateCard(
      theSwordOfShanYu,
      {
        costs: [mulanArmoredFighter],
      },
      true,
    );

    expect(testEngine.getCardModel(mulanArmoredFighter).exerted).toBe(false);
  });
});
