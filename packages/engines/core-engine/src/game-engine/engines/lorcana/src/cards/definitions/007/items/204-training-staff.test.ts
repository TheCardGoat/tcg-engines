/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  kashekimAncientRuler,
  trainingStaff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Training Staff", () => {
  it("PRECISION STRIKE {E}, 1 {I} – Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 1,
        play: [trainingStaff, kashekimAncientRuler],
      },
      {
        deck: 1,
      },
    );

    await testEngine.activateCard(trainingStaff);

    const target = testEngine.getCardModel(kashekimAncientRuler);

    expect(target.hasChallenger).toBe(false);

    await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });

    expect(target.hasChallenger).toBe(true);

    await testEngine.passTurn();
    expect(target.hasEvasive).toBe(false);
  });
});
