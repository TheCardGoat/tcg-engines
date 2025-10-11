import { describe, expect, it } from "bun:test";
import {
  atlanteanCrystal,
  goGoTomagoMechanicalEngineer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Atlantean Crystal", () => {
  it("SHIELDING LIGHT {E}, 2 {I} – Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      inkwell: 2,
      play: [atlanteanCrystal, goGoTomagoMechanicalEngineer],
    });

    expect(
      testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasResist,
    ).toBe(false);
    expect(
      testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
    ).toBe(false);

    await testEngine.activateCard(atlanteanCrystal, {
      targets: [goGoTomagoMechanicalEngineer],
    });

    expect(
      testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasResist,
    ).toBe(true);
    expect(
      testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
    ).toBe(true);
  });
});
