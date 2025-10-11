import { describe, expect, it } from "bun:test";
import {
  kashekimAncientRuler,
  trainingStaff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
