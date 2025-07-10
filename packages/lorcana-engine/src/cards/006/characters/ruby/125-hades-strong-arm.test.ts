/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  aladdinIntrepidCommander,
  hadesStrongArm,
  tootlesLostBoy,
} from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Hades - Strong Arm", () => {
  it("WHAT ARE YOU GONNA DO? {E}, 3 {I}, Banish one of your characters – Banish chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 3,
        play: [hadesStrongArm, aladdinIntrepidCommander],
      },
      {
        play: [tootlesLostBoy],
      },
    );

    await testEngine.activateCard(hadesStrongArm, {
      costs: [aladdinIntrepidCommander],
    });

    await testEngine.resolveTopOfStack({ targets: [tootlesLostBoy] });

    expect(testEngine.getCardModel(hadesStrongArm).exerted).toBe(true);
    expect(testEngine.getCardModel(tootlesLostBoy).isDead).toBe(true);
    expect(testEngine.getCardModel(aladdinIntrepidCommander).isDead).toBe(true);
  });
});
