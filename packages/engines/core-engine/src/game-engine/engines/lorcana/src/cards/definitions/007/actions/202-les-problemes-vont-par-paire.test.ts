/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  aladdinHeroicOutlaw,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { doubleTrouble } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Les Problemes Vont Par Paire", () => {
  it("Deal 1 damage to up to 2 chosen characters", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: doubleTrouble.cost,
        hand: [doubleTrouble],
      },
      {
        play: [aladdinHeroicOutlaw, moanaOfMotunui],
      },
    );

    await testEngine.playCard(doubleTrouble, {
      targets: [
        testEngine.getCardModel(aladdinHeroicOutlaw),
        testEngine.getCardModel(moanaOfMotunui),
      ],
    });

    expect(testEngine.getCardModel(aladdinHeroicOutlaw).damage).toBe(1);
    expect(testEngine.getCardModel(moanaOfMotunui).damage).toBe(1);
  });
});
